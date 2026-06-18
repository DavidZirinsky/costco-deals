export function transformProductData(item: any) {
  const id = item?.id ?? 'N/A';
  const title = item?.product?.title ?? 'No Title';
  const brand = item?.product?.brands?.[0] ?? 'No Brand';
  const itemNumber = item?.product?.variants?.[0]?.id ?? 'No Item Number';
  const programTypes = item?.product?.attributes?.program_types?.text ?? [];
  const onlinePrice = item?.variantRollupValues?.['inventory(847, price)']?.[0] ?? item?.variantRollupValues?.price?.[0] ?? null;
  const warehousePrice = item?.variantRollupValues?.['inventory(629-wh, price)']?.[0] ?? null;
  const warehouseAvailability = item?.variantRollupValues?.['inventory(629-wh, attributes.availability)']?.[0] ?? null;
  
  const price = onlinePrice;
  const marketingKeywords = item?.product?.attributes?.marketing_keywords?.text ?? [];
  const image = item?.product?.attributes?.primary_image?.text?.[0] ?? null;
  const uri = item?.product?.uri ?? '#';

  return {
    id,
    title,
    brand,
    itemNumber,
    programTypes,
    price,
    warehousePrice,
    warehouseAvailability,
    marketingKeywords,
    image,
    uri,
  };
}

/**
 * Transform items from the warehouse-mode search API (/search endpoint).
 * Response shape: { count, items: [{ itemNumber, itemDescription, sellPrice, ... }] }
 */
export function transformSearchProductData(item: any) {
  const id = item?.itemNumber ?? 'N/A';
  const title = item?.itemSign || item?.itemDescription || 'No Title';
  const itemNumber = item?.itemNumber ?? 'N/A';
  const sellPrice = item?.sellPrice ? parseFloat(item.sellPrice) : null;
  const originalSellPrice = item?.originalSellPrice ? parseFloat(item.originalSellPrice) : null;
  const inventoryStatus = item?.inventoryStatus ?? 'unknown';
  const departmentName = item?.departmentName ?? '';
  const image = item?.imageUrl ?? null;
  const uri = `https://www.costco.com/p/-/${itemNumber}`;
  const searchScore = item?.searchScore ? parseFloat(item.searchScore) : 0;

  return {
    id,
    title,
    brand: departmentName, // Use department as brand stand-in for display
    itemNumber,
    programTypes: [],
    price: sellPrice,
    originalPrice: originalSellPrice,
    warehousePrice: sellPrice, // This IS the warehouse price
    warehouseAvailability: inventoryStatus === 'in stock' ? 'IN_STOCK' : (inventoryStatus === 'out of stock' ? 'OUT_OF_STOCK' : inventoryStatus),
    inventoryStatus,
    marketingKeywords: [],
    image,
    uri,
    searchScore,
    departmentName,
  };
}
