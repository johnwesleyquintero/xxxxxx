import { allData } from './restock-file-handling.js';

function processListings(data) {
  const skuHeader = Object.keys(data[0]).find(header => header.toLowerCase().includes('sku'));
  const titleHeader = Object.keys(data[0]).find(header => header.toLowerCase().includes('title') || header.toLowerCase().includes('name'));
  const quantityHeader = Object.keys(data[0]).find(header => header.toLowerCase().includes('quantity') || header.toLowerCase().includes('qty'));
  const fulfillmentChannelHeader = Object.keys(data[0]).find(header => header.toLowerCase().includes('fulfillment') || header.toLowerCase().includes('channel'));
  if (!skuHeader) {
    throw new Error("SKU column not found in Listings file.");
  }
  if (!titleHeader) {
    throw new Error("Title column not found in Listings file.");
  }
  if (!quantityHeader) {
    throw new Error("Quantity column not found in Listings file.");
  }
  return data.map(row => ({
    SKU: (() => {
      const sku = row[skuHeader] || row["seller-sku"] || row["SKU"] || row["sku"];
      if (!sku) throw new Error("Missing SKU in Listings data");
      return sku;
    })(),
    Title: (() => {
      const title = row[titleHeader] || row["item-name"] || row["Title"] || row["title"];
      if (!title) throw new Error("Missing Title in Listings data");
      return title;
    })(),
    Quantity: (() => {
      const qty = parseInt(row[quantityHeader] ?? row["quantity"] ?? row["Quantity"] ?? row["qty"]) ?? 0;
      return isNaN(qty) ? 0 : qty;
    })(),
    FulfillmentChannel: row[fulfillmentChannelHeader] || row["fulfillment-channel"] || row["FulfillmentChannel"] || row["fulfillment_channel"]
  }));
}

function processFBA(data) {
  if (!data || data.length === 0) return [];
  const skuHeader = Object.keys(data[0]).find(header => header.toLowerCase().includes('sku'));
  const availableHeader = Object.keys(data[0]).find(header => header.toLowerCase().includes('available'));
  const inboundHeader = Object.keys(data[0]).find(header => header.toLowerCase().includes('inbound'));
  const reservedHeader = Object.keys(data[0]).find(header => header.toLowerCase().includes('reserved'));
  const recommendedHeader = Object.keys(data[0]).find(header => header.toLowerCase().includes('recommended'));
  if (!skuHeader) {
    throw new Error("SKU column not found in FBA Inventory file.");
  }
  if (!availableHeader) {
    throw new Error("Available Stock column not found in FBA Inventory file.");
  }
  if (!inboundHeader) {
    throw new Error("Inbound Stock column not found in FBA Inventory file.");
  }
  return data.map(row => ({
    SKU: row[skuHeader] || row["sku"] || row["SKU"],
    Available: (() => {
      const available = parseInt(row[availableHeader] ?? row["available"] ?? row["Available"]) ?? 0;
      return isNaN(available) ? 0 : available;
    })(),
    Inbound: (() => {
      const inbound = parseInt(row[inboundHeader] ?? row["inbound-quantity"] ?? row["Inbound Quantity"] ?? row["inbound"]) ?? 0;
      return isNaN(inbound) ? 0 : inbound;
    })(),
    Reserved: (() => {
      const reserved = parseInt(row[reservedHeader] ?? row["Total Reserved Quantity"] ?? row["Reserved"]) ?? 0;
      return isNaN(reserved) ? 0 : reserved;
    })(),
    Recommended: (() => {
      const recommended = parseInt(row[recommendedHeader] ?? row["Recommended ship-in quantity"] ?? row["Recommended"]) ?? 0;
      return isNaN(recommended) ? 0 : recommended;
    })()
  }));
}

function processBusiness(data) {
  if (!data || data.length === 0) return [];
  const asinHeader = Object.keys(data[0]).find(header => header.toLowerCase().includes('asin'));
  const unitsOrderedHeader = Object.keys(data[0]).find(header => header.toLowerCase().includes('units ordered') || header.toLowerCase().includes('unitsordered'));
  const salesHeader = Object.keys(data[0]).find(header => header.toLowerCase().includes('ordered product sales') || header.toLowerCase().includes('sales'));
  if (!asinHeader) {
    throw new Error("ASIN column not found in Business Report file.");
  }
  if (!unitsOrderedHeader) {
    throw new Error("Units Ordered column not found in Business Report file.");
  }
  return data.map(row => ({
    ASIN: row[asinHeader] || row["(Child) ASIN"] || row["ASIN"],
    UnitsOrdered: (() => {
      const unitsOrdered = parseInt((row[unitsOrderedHeader] || row["Units Ordered"] || "").replace(/,/g, "")) ?? 0;
      return isNaN(unitsOrdered) ? 0 : unitsOrdered;
    })(),
    Sales: (() => {
      const sales = parseFloat((row[salesHeader] || row["Ordered Product Sales"] || "").replace(/[^\d.-]/g, "")) ?? 0;
      return isNaN(sales) ? 0 : sales;
    })()
  }));
}

function mergeData() {
  let merged = {};

  // Initialize with listings data
  allData.listings.forEach(listing => {
    merged[listing.SKU] = {
      SKU: listing.SKU,
      Title: listing.Title || "Unknown",
      UnitsOrdered: 0,
      OrderedProductSales: 0,
      AvailableStock: listing.Quantity || 0,
      InboundStock: 0,
      Reserved: 0,
      TotalStock: listing.Quantity || 0,
      RecommendedShipmentAmount: 0,
      FulfillmentChannel: listing.FulfillmentChannel || "N/A"
    };
  });

  // Update with FBA data
  allData.fba.forEach(fba => {
    if (merged[fba.SKU]) {
      merged[fba.SKU].AvailableStock = fba.Available || merged[fba.SKU].AvailableStock;
      merged[fba.SKU].InboundStock = fba.Inbound || 0;
      merged[fba.SKU].Reserved = fba.Reserved || 0;
      merged[fba.SKU].TotalStock = (fba.Available || 0) + (fba.Inbound || 0) - (fba.Reserved || 0);
      merged[fba.SKU].RecommendedShipmentAmount = fba.Recommended || 0;
    } else {
      // If SKU not in listings, create a new entry
      merged[fba.SKU] = {
        SKU: fba.SKU,
        Title: "Unknown",
        UnitsOrdered: 0,
        OrderedProductSales: 0,
        AvailableStock: fba.Available || 0,
        InboundStock: 0,
        Reserved: fba.Reserved || 0,
        TotalStock: (fba.Available || 0) + (fba.Inbound || 0) - (fba.Reserved || 0),
        RecommendedShipmentAmount: fba.Recommended || 0,
        FulfillmentChannel: "N/A"
      };
    }
  });

  // Update with business data
  allData.business.forEach(business => {
    if (merged[business.ASIN]) {
      merged[business.ASIN].UnitsOrdered = business.UnitsOrdered || 0;
      merged[business.ASIN].OrderedProductSales = business.Sales || 0;
    } else {
      // If ASIN not in listings, create a new entry
      merged[business.ASIN] = {
        SKU: business.ASIN,
        Title: "Unknown",
        UnitsOrdered: 0,
        OrderedProductSales: 0,
        AvailableStock: 0,
        InboundStock: 0,
        Reserved: 0,
        TotalStock: 0,
        RecommendedShipmentAmount: 0,
        FulfillmentChannel: "N/A"
      };
    }
  });

  return Object.values(merged);
}

export { processListings, processFBA, processBusiness, mergeData };