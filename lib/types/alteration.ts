export type ItemOption = {
  label: string;
  value: string;
};

type PriceOption = {
  label: string;
  value: string;
  price: number;
};

export type PriceCategoryOption = {
  label: string;
  options: PriceOption[];
};

export type Price = {
  priceId: string;
  description: string;
};

export type Item = {
  id: string;
  qty: number;
  item: ItemOption;
  prices: PriceOption[];
};

export type ItemFormValues = {
  id?: string;
  qty: number;
  item_id: ItemOption;
  price_id: PriceOption[];
};
