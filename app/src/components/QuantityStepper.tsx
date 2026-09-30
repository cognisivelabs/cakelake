/** A −/count/+ stepper. `className` supplies the sizing — CartLineItem
 * and ItemDetailView each style it differently, via their own CSS
 * module's `.quantityStepper button`/`.quantityStepper span` rules
 * targeting these same elements through that passed-in class. */
export function QuantityStepper({
  quantity,
  onDecrease,
  onIncrease,
  className,
}: {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  className: string;
}) {
  return (
    <div className={className}>
      <button type="button" aria-label="Decrease quantity" onClick={onDecrease}>
        −
      </button>
      <span>{quantity}</span>
      <button type="button" aria-label="Increase quantity" onClick={onIncrease}>
        +
      </button>
    </div>
  );
}
