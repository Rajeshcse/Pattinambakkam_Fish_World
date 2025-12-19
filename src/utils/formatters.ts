/**
 * Utility functions for formatting quantities and weights
 * Base unit: 1 quantity = 250g
 */

/**
 * Converts quantity (integer) to weight display format
 * @param quantity - Integer quantity (1, 2, 3, 4...)
 * @returns Formatted weight string (e.g., "250g", "500g", "1kg", "1.25kg")
 *
 * @example
 * formatQuantityToWeight(1)  // "250g"
 * formatQuantityToWeight(2)  // "500g"
 * formatQuantityToWeight(4)  // "1kg"
 * formatQuantityToWeight(5)  // "1.25kg"
 * formatQuantityToWeight(10) // "2.5kg"
 */
export const formatQuantityToWeight = (quantity: number): string => {
  const grams = quantity * 250;

  if (grams < 1000) {
    return `${grams}g`;
  }

  const kg = grams / 1000;
  // Remove unnecessary decimals (2.0kg -> 2kg, 2.5kg -> 2.5kg)
  return kg % 1 === 0 ? `${kg}kg` : `${kg.toFixed(2)}kg`;
};

/**
 * Converts stock units to weight display format
 * @param stock - Stock in units (each unit = 250g)
 * @returns Formatted weight string
 *
 * @example
 * formatStockToWeight(4)   // "1kg"
 * formatStockToWeight(10)  // "2.5kg"
 * formatStockToWeight(100) // "25kg"
 */
export const formatStockToWeight = (stock: number): string => {
  return formatQuantityToWeight(stock);
};

/**
 * Converts weight in grams to quantity units
 * @param grams - Weight in grams
 * @returns Quantity (number of 250g units)
 *
 * @example
 * convertGramsToQuantity(250)  // 1
 * convertGramsToQuantity(500)  // 2
 * convertGramsToQuantity(1000) // 4
 */
export const convertGramsToQuantity = (grams: number): number => {
  return Math.floor(grams / 250);
};

/**
 * Converts weight in kg to quantity units
 * @param kg - Weight in kilograms
 * @returns Quantity (number of 250g units)
 *
 * @example
 * convertKgToQuantity(1)    // 4
 * convertKgToQuantity(2.5)  // 10
 * convertKgToQuantity(0.5)  // 2
 */
export const convertKgToQuantity = (kg: number): number => {
  return Math.floor((kg * 1000) / 250);
};

/**
 * Formats quantity with weight in parentheses
 * @param quantity - Integer quantity
 * @returns Formatted string (e.g., "4 (1kg)", "5 (1.25kg)")
 *
 * @example
 * formatQuantityWithWeight(1)  // "1 (250g)"
 * formatQuantityWithWeight(4)  // "4 (1kg)"
 * formatQuantityWithWeight(5)  // "5 (1.25kg)"
 */
export const formatQuantityWithWeight = (quantity: number): string => {
  const weight = formatQuantityToWeight(quantity);
  return `${quantity} (${weight})`;
};

/**
 * Gets readable stock status message
 * @param stock - Stock in units (each unit = 250g)
 * @returns Object with status text and color class
 *
 * @example
 * getStockStatus(0)  // { text: "Out of Stock", color: "text-red-600" }
 * getStockStatus(5)  // { text: "Only 1.25kg left", color: "text-orange-600" }
 * getStockStatus(50) // { text: "In Stock", color: "text-green-600" }
 */
export const getStockStatus = (
  stock: number
): { text: string; color: string } => {
  if (stock === 0) {
    return { text: 'Out of Stock', color: 'text-red-600' };
  } else if (stock < 10) {
    // Less than 2.5kg
    const weight = formatStockToWeight(stock);
    return { text: `Only ${weight} left`, color: 'text-orange-600' };
  }
  return { text: 'In Stock', color: 'text-green-600' };
};
