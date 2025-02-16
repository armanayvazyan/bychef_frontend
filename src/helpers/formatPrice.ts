export default function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US").format(price);
}