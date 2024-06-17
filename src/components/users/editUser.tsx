import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Role, User } from "@prisma/client"

import { Button } from "@/components/ui/button"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/ui/icons"

// Esquema de validación para el formulario
const FormSchema = z.object({
  name: z.string({
    required_error: "El nombre es requerido.",
  }),
  role: z.nativeEnum(Role),
})

type NewRegisterProps = {
  handleEditUser: any,
  user: User,
  loading: boolean
}

// Componente para editar un usuario
export function EditUser({ handleEditUser, user, loading }: NewRegisterProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
  })
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsOpen(false)
    try {
      await handleEditUser({
        variables: {
          id: user.id,
          name: data.name,
          role: data.role,
        }
      })
      toast({
        title: "Usuario editado",
        description: "El usuario ha sido editado exitosamente."
      })
    }
    catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al editar el usuario."
      })
    }
  }

  // Actualiza los valores del formulario con los datos del usuario
  useEffect(() => {
    form.setValue("name", user.name ?? "")
    form.setValue("role", user.role)
  }, [user])

  return (
    <>
      <Dialog defaultOpen={false} open={isOpen} onOpenChange={(isOpen) => setIsOpen(isOpen)}>
        <DialogTrigger asChild>
          {loading ? (
            <Button disabled>
              <LoadingSpinner className="h-5 w-11" />
            </Button>
          ) : (
            <Button>Editar</Button>
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
                name="name"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Nombre</FormLabel>
                    <Input {...field} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue>
                            {field.value === Role.ADMIN ? Role.ADMIN : Role.USER}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={Role.ADMIN}>Administrador</SelectItem>
                        <SelectItem value={Role.USER}>Usuario</SelectItem>
                      </SelectContent>
                    </Select>
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

