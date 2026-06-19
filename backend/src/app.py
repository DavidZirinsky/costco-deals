import logging
import os
from enum import Enum

import requests
import uvicorn
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SortEnum(str, Enum):
    LASTWEEK = "lastWeek"
    INVENTORYSTATUS = "inventoryStatus"
    SELLPRICE = "sellPrice"


class SortDirection(str, Enum):
    ASC = "asc"
    DESC = "desc"


@app.get("/")
def status():
    return {"status": "ok", "service": "tldw"}


@app.get("/search")
def search(
    keyword: str = Query(..., description="keyword for your search"),
    warehouse: str = Query(..., description="warehouse id"),
    sortField: SortEnum = Query(SortEnum.LASTWEEK, description="Sort field"),
    sortDirection: SortDirection = Query(
        SortDirection.DESC, description="Sort direction"
    ),
):

    url = "https://gdx-api-mobileapps.costco.com/consumer-mobile/core/warehouse-mode/v1/mobile/whmodebffservice/items"

    payload = {
        "type": "com.costco.app.core.model.network.BffIOHRequest",
        "currentWarehouse": warehouse,
        "selectedWarehouse": warehouse,
        "searchTerm": str(keyword),
        "maxWhCount": "10",
        "sortField": sortField.value,
        "sortDirection": sortDirection.value,
        "locale": "en_US",
        "relevance": 80,
        "validMember": True,
    }
    headers = {
        "User-Agent": "device/Android",
        "whmod": os.environ.get("SPECIALS_WHMOD"),
        "Cache-Control": "no-cache",
        "Content-Type": "application/json; charset=utf-8",
        "Connection": "Keep-Alive",
    }

    response = requests.request("POST", url, headers=headers, json=payload)
    return JSONResponse(status_code=response.status_code, content=response.json())


@app.get("/costco")
def summarize(
    warehouse: str = Query(..., description="warehouse id"),
):
    url = "https://gdx-api.costco.com/catalog/search/api/v1/search"
    warehouse_id = f"{warehouse}-wh"
    payload = {
        "deliveryLocations": [
            "1252-3pl",
            "1253-3pl",
            "1321-wm",
            "1483-3pl",
            "283-wm",
            "561-wm",
            "725-wm",
            "731-wm",
            "758-wm",
            "759-wm",
            "847_0-cor",
            "847_0-cwt",
            "847_0-edi",
            "847_0-ehs",
            "847_0-membership",
            "847_0-mpt",
            "847_0-spc",
            "847_0-wm",
            "847_1-cwt",
            "847_1-edi",
            "847_bosch_1471-edi",
            "847_d-fis",
            "847_ge_den-edi",
            "847_lg_ntx-edi",
            "847_lux_us21-edi",
            "847_NA-cor",
            "847_NA-pharmacy",
            "847_NA-wm",
            "847_ss_u359-edi",
            "847_wp_r457-edi",
            "951-wm",
            "952-wm",
            "9847-wcs",
            "1665-bd",
            warehouse_id,
        ],
        "filterBy": [],
        "offset": 0,
        "pageSize": 1000,
        "personalizationEnabled": False,
        "query": "whilesupplieslast",
        "searchMode": "page",
        "orderBy": "price",
        "visitorId": os.environ.get("SPECIALS_VISITOR_ID"),
        "warehouseId": warehouse_id,
    }
    headers = {
        "User-Agent": "device/Android",
        "locale": "en-US",
        "searchResultProvider": "GRS",
        "client_id": "USBC",
        "client-identifier": os.environ.get("SPECIALS_CLIENT_IDENTIFIER"),
        "client-secret": os.environ.get("SPECIALS_CLIENT_SECRET"),
        "Cache-Control": "no-cache",
        "Content-Type": "application/json; charset=UTF-8",
        "Connection": "Keep-Alive",
    }

    response = requests.request("POST", url, headers=headers, json=payload)
    return JSONResponse(status_code=response.status_code, content=response.json())


@app.get("/warehouses")
def get_warehouses(location: str = Query(..., description="City, State or Zip Code")):
    """
    Unifies geocoding and warehouse lookup.
    Takes a human-readable location and returns nearby Costco warehouses.
    """

    bing_url = "https://dev.virtualearth.net/REST/v1/Locations"
    bing_params = {
        "q": location,
        "maxResults": 1,
        "key": os.environ.get("BING_SEARCH_KEY"),
    }
    headers = {
        "User-Agent": "device/Android",
        "Accept": "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Referer": "https://www.costco.com/",
        "Origin": "https://www.costco.com",
        "Connection": "keep-alive",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
        "Sec-GPC": "1",
        "Priority": "u=4",
    }

    try:
        bing_res = requests.get(bing_url, params=bing_params, headers=headers)
        bing_res.raise_for_status()
        bing_data = bing_res.json()

        resources = bing_data.get("resourceSets", [{}])[0].get("resources", [])
        if not resources:
            raise HTTPException(status_code=404, detail="Location not found")

        lat, lon = resources[0]["point"]["coordinates"]
    except Exception as e:
        logging.error(f"Geolocation service error: {e}")
        raise HTTPException(status_code=500, detail=f"Geolocation service error")

    costco_url = (
        "https://ecom-api.costco.com/core/warehouse-locator/v1/salesLocations.json"
    )
    costco_headers = {
        "User-Agent": "device/Android",
        "client-identifier": os.environ.get("SEARCH_CLIENT_IDENTIFIER"),
        "Referer": "https://www.costco.com/",
    }
    costco_params = {"latitude": lat, "longitude": lon, "limit": 10}

    try:
        costco_res = requests.get(
            costco_url, headers=costco_headers, params=costco_params
        )
        costco_res.raise_for_status()
        return costco_res.json()
    except Exception as e:
        logging.error(f"Costco API error: {e}")
        raise HTTPException(status_code=500, detail=f"Costco API error")


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port, reload=os.environ.get("DEBUG", False))
