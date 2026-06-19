from unittest.mock import MagicMock, patch

from fastapi.testclient import TestClient


@patch("requests.post")
def test_search_endpoint(mock_post: MagicMock, client: TestClient):
    costco_response = {
        "count": "1",
        "items": [
            {
                "searchScore": "97.280235",
                "itemNumber": "1018249",
                "itemDescription": "ORGANIC ATAULFO MANGOS",
                "imageUrl": "https://bfasset.costco-static.com/U447IH35/as/2444q9xk26cfsfh3r74v2jj5/1018249-inc__1?auto=webp&format=jpg",
                "images": [
                    "https://bfasset.costco-static.com/U447IH35/as/2444q9xk26cfsfh3r74v2jj5/1018249-inc__1?auto=webp&format=jpg",
                    "https://bfasset.costco-static.com/U447IH35/as/725jsknqchjgrchbpbfqc5/1018249-inc__2?auto=webp&format=jpg",
                ],
                "sellPrice": "8.99",
                "inventoryOnHand": "",
                "inventoryStatus": "in stock",
                "itemSign": "ORGANIC ATAULFO MANGOS 6 COUNT",
                "departmentNumber": "65",
                "departmentName": "PRODUCE",
                "category": "1T3",
                "region": "SD",
                "originalSellPrice": "8.99",
                "randomWeightIndicator": False,
                "consumerHealthIndicator": False,
            }
        ],
    }
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = costco_response
    mock_post.return_value = mock_response

    response = client.get(
        "/search?keyword=mango&warehouse=629&sortField=lastWeek&sortDirection=desc"
    )

    assert response.status_code == 200
    assert response.json() == costco_response


@patch("requests.post")
def test_costco_endpoint(mock_post: MagicMock, client: TestClient):
    costco_response = {
        "searchResultProvider": "GRS",
        "locale": "en-US",
        "client_id": "USBC",
        "searchResult": {
            "results": [
                {
                    "id": "4000360941",
                    "product": {
                        "name": "projects/765882799461/locations/global/catalogs/default_catalog/branches/0/products/4000360941",
                        "id": "",
                        "type": "TYPE_UNSPECIFIED",
                        "primaryProductId": "",
                        "collectionMemberIds": [],
                        "gtin": "",
                        "categories": [
                            "Clothing, Luggage & Handbags",
                            "Clothing, Luggage & Handbags > Clothing for Kids",
                            "Clothing, Luggage & Handbags > Clothing for Kids > Sets for Kids",
                        ],
                        "title": "Carter's Kids' 3-piece Playwear Set",
                        "brands": ["Carter's"],
                        "description": "",
                        "languageCode": "",
                        "attributes": {
                            "min_item_order_qty": {"text": ["1"], "numbers": []},
                            "category_names": {
                                "text": [
                                    "Clothing, Luggage & Handbags",
                                    "Clothing for Kids",
                                    "Sets for Kids",
                                    "Clothing Promotion Ineligible",
                                ],
                                "numbers": [],
                            },
                            "member_only": {"text": [], "numbers": [0]},
                            "as400_department": {"text": ["39"], "numbers": []},
                            "primary_image": {
                                "text": [
                                    "https://bfasset.costco-static.com/U447IH35/as/2b9j6gkmx7hnr74rrxsv47x4/4000360941-847__1?auto=webp&format=jpg"
                                ],
                                "numbers": [],
                            },
                            "fsa_eligible": {"text": [], "numbers": [0]},
                            "disp_price_in_cart_only": {"text": [], "numbers": [0]},
                            "chdi_eligible": {"text": [], "numbers": [0]},
                            "product_class_type": {"text": ["Standard"], "numbers": []},
                            "program_types": {
                                "text": [
                                    "SiteControlledInventory",
                                    "Standard",
                                    "ShipIt",
                                ],
                                "numbers": [],
                            },
                            "max_item_order_qty": {"text": ["9999.0"], "numbers": []},
                            "product_type": {"text": ["Product"], "numbers": []},
                            "buyable": {"text": [], "numbers": [1]},
                            "reviews_eligible": {"text": [], "numbers": [1]},
                            "comparable": {"text": [], "numbers": [1]},
                            "swatchable": {"text": [], "numbers": [0]},
                            "as400_category": {"text": ["CFA"], "numbers": []},
                            "marketing_keywords": {
                                "text": [
                                    "1934898",
                                    "effortless0102",
                                    "Apparel0107",
                                    "apparel116",
                                    "fitnessfashion110",
                                    "vdayfits",
                                    "vdaylooks22",
                                    "whilesupplieslast",
                                ],
                                "numbers": [],
                            },
                        },
                        "tags": [],
                        "rating": {
                            "ratingCount": 16,
                            "averageRating": 4.75,
                            "ratingHistogram": [],
                        },
                        "availability": "AVAILABILITY_UNSPECIFIED",
                        "fulfillmentInfo": [],
                        "uri": "https://www.costco.com/p/-/carters-kids-3-piece-playwear-set/4000360941",
                        "images": [],
                        "sizes": [],
                        "materials": [],
                        "patterns": [],
                        "conditions": [],
                        "promotions": [],
                        "variants": [
                            {
                                "name": "projects/765882799461/locations/global/catalogs/default_catalog/branches/0/products/1939493",
                                "id": "1939493",
                                "type": "VARIANT",
                                "primaryProductId": "",
                                "collectionMemberIds": [],
                                "gtin": "",
                                "categories": [],
                                "title": "Carter's Kids' 3-piece Playwear Set, Purple, 2T",
                                "brands": [],
                                "description": "",
                                "languageCode": "",
                                "attributes": {
                                    "product_type": {
                                        "text": ["Item"],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "max_item_order_qty": {
                                        "text": ["9999.0"],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "product_class_type": {
                                        "text": ["Standard"],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "program_types": {
                                        "text": [
                                            "Google",
                                            "SiteControlledInventory",
                                            "Standard",
                                            "ShipIt",
                                        ],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "swatchable": {
                                        "text": [],
                                        "numbers": [0],
                                        "indexable": False,
                                    },
                                    "as400_category": {
                                        "text": ["CFA"],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "comparable": {
                                        "text": [],
                                        "numbers": [1],
                                        "indexable": False,
                                    },
                                    "reviews_eligible": {
                                        "text": [],
                                        "numbers": [1],
                                        "indexable": False,
                                    },
                                    "buyable": {
                                        "text": [],
                                        "numbers": [1],
                                        "indexable": False,
                                    },
                                    "min_item_order_qty": {
                                        "text": ["1"],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "category_names": {
                                        "text": [
                                            "Clothing, Luggage & Handbags",
                                            "Clothing for Kids",
                                            "Sets for Kids",
                                            "Clothing Promotion Ineligible",
                                        ],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "chdi_eligible": {
                                        "text": [],
                                        "numbers": [0],
                                        "indexable": False,
                                    },
                                    "fsa_eligible": {
                                        "text": [],
                                        "numbers": [0],
                                        "indexable": False,
                                    },
                                    "disp_price_in_cart_only": {
                                        "text": [],
                                        "numbers": [0],
                                        "indexable": False,
                                    },
                                    "member_only": {
                                        "text": [],
                                        "numbers": [0],
                                        "indexable": False,
                                    },
                                    "primary_image": {
                                        "text": [
                                            "https://bfasset.costco-static.com/U447IH35/as/553f4pbvn9xjt7cngvbm6spk/4000360941-847_purple_1?auto=webp&format=jpg"
                                        ],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "as400_department": {
                                        "text": ["39"],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                },
                                "tags": [],
                                "availability": "AVAILABILITY_UNSPECIFIED",
                                "fulfillmentInfo": [],
                                "uri": "https://www.costco.com/p/-/carters-kids-3-piece-playwear-set-purple-2t/1939493",
                                "images": [],
                                "colorInfo": {
                                    "colorFamilies": ["Purple"],
                                    "colors": ["Purple"],
                                },
                                "sizes": [],
                                "materials": [],
                                "patterns": [],
                                "conditions": [],
                                "promotions": [],
                                "variants": [],
                                "localInventories": [],
                            },
                            {
                                "name": "projects/765882799461/locations/global/catalogs/default_catalog/branches/0/products/1939494",
                                "id": "1939494",
                                "type": "VARIANT",
                                "primaryProductId": "",
                                "collectionMemberIds": [],
                                "gtin": "",
                                "categories": [],
                                "title": "Carter's Kids' 3-piece Playwear Set, Purple, 3T",
                                "brands": [],
                                "description": "",
                                "languageCode": "",
                                "attributes": {
                                    "product_type": {
                                        "text": ["Item"],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "max_item_order_qty": {
                                        "text": ["9999.0"],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "product_class_type": {
                                        "text": ["Standard"],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "program_types": {
                                        "text": [
                                            "Google",
                                            "SiteControlledInventory",
                                            "Standard",
                                            "ShipIt",
                                        ],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "swatchable": {
                                        "text": [],
                                        "numbers": [0],
                                        "indexable": False,
                                    },
                                    "as400_category": {
                                        "text": ["CFA"],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "comparable": {
                                        "text": [],
                                        "numbers": [1],
                                        "indexable": False,
                                    },
                                    "reviews_eligible": {
                                        "text": [],
                                        "numbers": [1],
                                        "indexable": False,
                                    },
                                    "buyable": {
                                        "text": [],
                                        "numbers": [1],
                                        "indexable": False,
                                    },
                                    "min_item_order_qty": {
                                        "text": ["1"],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "category_names": {
                                        "text": [
                                            "Clothing, Luggage & Handbags",
                                            "Clothing for Kids",
                                            "Sets for Kids",
                                            "Clothing Promotion Ineligible",
                                        ],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "chdi_eligible": {
                                        "text": [],
                                        "numbers": [0],
                                        "indexable": False,
                                    },
                                    "fsa_eligible": {
                                        "text": [],
                                        "numbers": [0],
                                        "indexable": False,
                                    },
                                    "disp_price_in_cart_only": {
                                        "text": [],
                                        "numbers": [0],
                                        "indexable": False,
                                    },
                                    "member_only": {
                                        "text": [],
                                        "numbers": [0],
                                        "indexable": False,
                                    },
                                    "primary_image": {
                                        "text": [
                                            "https://bfasset.costco-static.com/U447IH35/as/553f4pbvn9xjt7cngvbm6spk/4000360941-847_purple_1?auto=webp&format=jpg"
                                        ],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "as400_department": {
                                        "text": ["39"],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                },
                                "tags": [],
                                "availability": "AVAILABILITY_UNSPECIFIED",
                                "fulfillmentInfo": [],
                                "uri": "https://www.costco.com/p/-/carters-kids-3-piece-playwear-set-purple-3t/1939494",
                                "images": [],
                                "colorInfo": {
                                    "colorFamilies": ["Purple"],
                                    "colors": ["Purple"],
                                },
                                "sizes": [],
                                "materials": [],
                                "patterns": [],
                                "conditions": [],
                                "promotions": [],
                                "variants": [],
                                "localInventories": [],
                            },
                            {
                                "name": "projects/765882799461/locations/global/catalogs/default_catalog/branches/0/products/1939497",
                                "id": "1939497",
                                "type": "VARIANT",
                                "primaryProductId": "",
                                "collectionMemberIds": [],
                                "gtin": "",
                                "categories": [],
                                "title": "Carter's Kids' 3-piece Playwear Set, Purple, 6",
                                "brands": [],
                                "description": "",
                                "languageCode": "",
                                "attributes": {
                                    "swatchable": {
                                        "text": [],
                                        "numbers": [0],
                                        "indexable": False,
                                    },
                                    "as400_category": {
                                        "text": ["CFA"],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "comparable": {
                                        "text": [],
                                        "numbers": [1],
                                        "indexable": False,
                                    },
                                    "reviews_eligible": {
                                        "text": [],
                                        "numbers": [1],
                                        "indexable": False,
                                    },
                                    "buyable": {
                                        "text": [],
                                        "numbers": [1],
                                        "indexable": False,
                                    },
                                    "product_type": {
                                        "text": ["Item"],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "max_item_order_qty": {
                                        "text": ["9999.0"],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "product_class_type": {
                                        "text": ["Standard"],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "program_types": {
                                        "text": [
                                            "Google",
                                            "SiteControlledInventory",
                                            "Standard",
                                            "ShipIt",
                                        ],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "chdi_eligible": {
                                        "text": [],
                                        "numbers": [0],
                                        "indexable": False,
                                    },
                                    "fsa_eligible": {
                                        "text": [],
                                        "numbers": [0],
                                        "indexable": False,
                                    },
                                    "disp_price_in_cart_only": {
                                        "text": [],
                                        "numbers": [0],
                                        "indexable": False,
                                    },
                                    "member_only": {
                                        "text": [],
                                        "numbers": [0],
                                        "indexable": False,
                                    },
                                    "primary_image": {
                                        "text": [
                                            "https://bfasset.costco-static.com/U447IH35/as/553f4pbvn9xjt7cngvbm6spk/4000360941-847_purple_1?auto=webp&format=jpg"
                                        ],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "as400_department": {
                                        "text": ["39"],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "min_item_order_qty": {
                                        "text": ["1"],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "category_names": {
                                        "text": [
                                            "Clothing, Luggage & Handbags",
                                            "Clothing for Kids",
                                            "Sets for Kids",
                                            "Clothing Promotion Ineligible",
                                        ],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                },
                                "tags": [],
                                "availability": "AVAILABILITY_UNSPECIFIED",
                                "fulfillmentInfo": [],
                                "uri": "https://www.costco.com/p/-/carters-kids-3-piece-playwear-set-purple-6/1939497",
                                "images": [],
                                "colorInfo": {
                                    "colorFamilies": ["Purple"],
                                    "colors": ["Purple"],
                                },
                                "sizes": [],
                                "materials": [],
                                "patterns": [],
                                "conditions": [],
                                "promotions": [],
                                "variants": [],
                                "localInventories": [],
                            },
                            {
                                "name": "projects/765882799461/locations/global/catalogs/default_catalog/branches/0/products/1939495",
                                "id": "1939495",
                                "type": "VARIANT",
                                "primaryProductId": "",
                                "collectionMemberIds": [],
                                "gtin": "",
                                "categories": [],
                                "title": "Carter's Kids' 3-piece Playwear Set, Purple, 4T",
                                "brands": [],
                                "description": "",
                                "languageCode": "",
                                "attributes": {
                                    "product_class_type": {
                                        "text": ["Standard"],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "program_types": {
                                        "text": [
                                            "Google",
                                            "SiteControlledInventory",
                                            "Standard",
                                            "ShipIt",
                                        ],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "max_item_order_qty": {
                                        "text": ["9999.0"],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "product_type": {
                                        "text": ["Item"],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "reviews_eligible": {
                                        "text": [],
                                        "numbers": [1],
                                        "indexable": False,
                                    },
                                    "buyable": {
                                        "text": [],
                                        "numbers": [1],
                                        "indexable": False,
                                    },
                                    "comparable": {
                                        "text": [],
                                        "numbers": [1],
                                        "indexable": False,
                                    },
                                    "swatchable": {
                                        "text": [],
                                        "numbers": [0],
                                        "indexable": False,
                                    },
                                    "as400_category": {
                                        "text": ["CFA"],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "min_item_order_qty": {
                                        "text": ["1"],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "category_names": {
                                        "text": [
                                            "Clothing, Luggage & Handbags",
                                            "Clothing for Kids",
                                            "Sets for Kids",
                                            "Clothing Promotion Ineligible",
                                        ],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "member_only": {
                                        "text": [],
                                        "numbers": [0],
                                        "indexable": False,
                                    },
                                    "primary_image": {
                                        "text": [
                                            "https://bfasset.costco-static.com/U447IH35/as/553f4pbvn9xjt7cngvbm6spk/4000360941-847_purple_1?auto=webp&format=jpg"
                                        ],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "as400_department": {
                                        "text": ["39"],
                                        "numbers": [],
                                        "searchable": False,
                                        "indexable": False,
                                    },
                                    "fsa_eligible": {
                                        "text": [],
                                        "numbers": [0],
                                        "indexable": False,
                                    },
                                    "disp_price_in_cart_only": {
                                        "text": [],
                                        "numbers": [0],
                                        "indexable": False,
                                    },
                                    "chdi_eligible": {
                                        "text": [],
                                        "numbers": [0],
                                        "indexable": False,
                                    },
                                },
                                "tags": [],
                                "availability": "AVAILABILITY_UNSPECIFIED",
                                "fulfillmentInfo": [],
                                "uri": "https://www.costco.com/p/-/carters-kids-3-piece-playwear-set-purple-4t/1939495",
                                "images": [],
                                "colorInfo": {
                                    "colorFamilies": ["Purple"],
                                    "colors": ["Purple"],
                                },
                                "sizes": [],
                                "materials": [],
                                "patterns": [],
                                "conditions": [],
                                "promotions": [],
                                "variants": [],
                                "localInventories": [],
                            },
                        ],
                        "localInventories": [],
                    },
                    "matchingVariantCount": 4,
                    "matchingVariantFields": {},
                    "variantRollupValues": {
                        "attributes.product_class_type": ["Standard"],
                        "attributes.buyable": [1],
                        "inventory(847, price)": [6.97],
                        "attributes.as400_department": ["39"],
                        "attributes.chdi_eligible": [0],
                        "attributes.program_types": [
                            "Google",
                            "SiteControlledInventory",
                            "Standard",
                            "ShipIt",
                        ],
                        "attributes.start_date": ["2025-12-22 00:00:00.001"],
                        "attributes.as400_category": ["CFA"],
                        "attributes.member_only": [0],
                        "attributes.max_item_order_qty": ["9999.0"],
                        "variantId": ["1939493", "1939494", "1939495", "1939497"],
                        "attributes.fsa_eligible": [0],
                        "originalPrice": [6.97],
                        "inventory(847, originalPrice)": [6.97],
                        "attributes.min_item_order_qty": ["1"],
                        "inventory(283-wm, attributes.availability)": [
                            "IN_STOCK",
                            "IN_STOCK",
                            "IN_STOCK",
                            "IN_STOCK",
                        ],
                        "inventory(1321-wm, attributes.availability)": [
                            "IN_STOCK",
                            "IN_STOCK",
                            "IN_STOCK",
                            "IN_STOCK",
                        ],
                        "price": [6.97],
                    },
                    "personalLabels": [],
                },
            ],
            "filterEvent": {
                "isFilterOnlyEvent": True,
                "filters": ['attributes.marketing_keywords: ANY("whilesupplieslast")'],
            },
            "pageCategories": ["marketing > whilesupplieslast"],
            "breadcrumb": None,
        },
    }
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = costco_response
    mock_post.return_value = mock_response

    response = client.get(
        "/costco?keyword=mango&warehouse=629&sortField=lastWeek&sortDirection=desc"
    )

    assert response.status_code == 200
    assert response.json() == costco_response


@patch("requests.get")
def test_warehouse_endpoint(mock_get: MagicMock, client: TestClient):
    bing_response = {
        "resourceSets": [
            {
                "estimatedTotal": 1,
                "resources": [
                    {
                        "__type": "Location:http://schemas.microsoft.com/search/local/ws/rest/v1",
                        "bbox": [
                            39.715858459472656,
                            -104.94082641601562,
                            39.74747085571289,
                            -104.88462829589844,
                        ],
                        "name": "80220, CO",
                        "point": {
                            "type": "Point",
                            "coordinates": [39.73268127, -104.91503143],
                        },
                        "address": {
                            "adminDistrict": "CO",
                            "adminDistrict2": "Denver County",
                            "countryRegion": "United States",
                            "formattedAddress": "80220, CO",
                            "locality": "Denver",
                            "postalCode": "80220",
                        },
                        "confidence": "High",
                        "entityType": "Postcode1",
                        "geocodePoints": [
                            {
                                "type": "Point",
                                "coordinates": [39.73268127, -104.91503143],
                                "calculationMethod": "Rooftop",
                                "usageTypes": ["Display"],
                            }
                        ],
                        "matchCodes": ["Good"],
                    }
                ],
            }
        ],
        "statusCode": 200,
        "statusDescription": "OK",
    }
    costco_response = {
        "context": {
            "messageName": "SalesLocationSearchResponse",
            "timestamp": "2026-06-19T16:41:58.924005462Z",
            "statusMessage": {"statusCode": "Success"},
            "lastPage": False,
            "totalResults": -1,
        },
        "salesLocations": [
            {
                "salesLocationId": "439",
                "name": [{"value": "Aurora", "localeCode": "en-US"}],
                "distance": 3.848538411194702,
                "distanceUnit": "mi",
                "type": {
                    "code": "Sales Location",
                    "name": [{"value": "Sales Location", "localeCode": "en-US"}],
                },
            }
        ],
    }

    mock_response_1 = MagicMock()
    mock_response_1.status_code = 200
    mock_response_1.json.return_value = bing_response

    mock_response_2 = MagicMock()
    mock_response_2.status_code = 200
    mock_response_2.json.return_value = costco_response

    mock_get.side_effect = [mock_response_1, mock_response_2]

    response = client.get("/warehouses?location=80220")

    assert response.status_code == 200
    assert response.json() == costco_response
