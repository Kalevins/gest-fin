import CurrencyInputField, {CurrencyInputProps} from 'react-currency-input-field';

export const CurrencyInput = ({ value, onValueChange }: CurrencyInputProps) => {
  return (
    <CurrencyInputField
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      value={value}
      onValueChange={onValueChange}
      decimalSeparator=","
      prefix='$'
      groupSeparator="."
      maxLength={12}
    />
  )
}
