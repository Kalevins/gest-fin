// DCorrige el formato de la fecha
export const fixDate = (date: string) => {
  try {
    const numberDate = parseInt(date)
    return new Date(numberDate).toLocaleDateString();
  } catch (error) {
    return new Date(date).toLocaleDateString();
  }
}

// Corrige el formato de la cantidad
export const fixAmount = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}