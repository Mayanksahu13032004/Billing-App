import numberToWords from "number-to-words";

export default function toWords(amount) {
  return (
    "RUPEES " +
    numberToWords.toWords(amount).toUpperCase() +
    " ONLY"
  );
}
