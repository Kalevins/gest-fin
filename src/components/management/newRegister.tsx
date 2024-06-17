import { useState } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { MovementType } from "@prisma/client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { CurrencyInput } from "@/components/ui/currencyInput"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/ui/icons"

// Esquema de validación para el formulario
const FormSchema = z.object({
  amount: z.string({
    required_error: "El monto es requerido.",
  }).min(1, {
    message: "El monto debe ser mayor a 0.",
  }),
  concept: z.string({
    required_error: "El concepto es requerido.",
  }),
  type: z.string({
    required_error: "El tipo es requerido.",
  }),
  date: z.date({
    required_error: "La fecha es requerida.",
  }),
})

type NewRegisterProps = {
  handleNewRegister: any
  loading: boolean
}

// Componente para crear un nuevo registro
export function NewRegister({ handleNewRegister, loading }: NewRegisterProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setIsOpen(false)
      await handleNewRegister({
        variables: {
          concept: data.concept,
          amount: parseFloat(data.amount),
          date: data.date.toISOString(),
          type: data.type,
        }
      })
      toast({
        title: "Registro creado",
        description: "El registro se ha creado correctamente"
      })
    }
    catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al crear el registro"
      })
    }
    finally {
      form.reset()
    }
  }

  return (
    <>
      <Dialog defaultOpen={false} open={isOpen} onOpenChange={(isOpen) => setIsOpen(isOpen)}>
        <DialogTrigger asChild>
          {loading ? (
            <Button disabled>
              <LoadingSpinner className="h-5 w-11" />
            </Button>
          ) : (
            <Button>Nuevo</Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nuevo registro</DialogTitle>
            <DialogDescription>Complete los campos para crear un nuevo registro</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Monto</FormLabel>
                    <CurrencyInput value={field.value} onValueChange={(value) => field.onChange(value)} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="concept"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Concepto</FormLabel>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={MovementType.EXPENSE}>Egreso</SelectItem>
                        <SelectItem value={MovementType.INCOME}>Ingreso</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Selecciona una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date()
                        }
                      />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

