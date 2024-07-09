import { z } from "zod";
// import { PaymentType } from "../schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { statuses } from "@/components/DataTable/filters";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Layout } from "@/components/custom/layout";
import ThemeSwitch from "@/components/theme-switch";
import { UserNav } from "@/components/user-nav";
import agent from "@/api/agent";

// type EditProps = {
//   product: ProductType;
// };

interface Product {}

interface ManageProductForm {}

const editSchema = z.object({
  productId: z.number(),
  productName: z.string().min(1, { message: "Product Name Required" }),
  description: z.string(),
  price: z.coerce.number().refine((value) => value > 0, {
    message: "Price must be greater than 0.",
  }),
  status: z.number(),
  image: z.string(),
  category: z.object({
    categoryId: z.coerce.number().refine((value) => value > 0, {
      message: "Category Required.",
    }),
  }),

  brand: z.object({
    brandId: z.coerce.number().refine((value) => value > 0, {
      message: "Brand Required.",
    }),
  }),
});

type editSchemaType = z.infer<typeof editSchema>;

export const AddProduct: React.FC<ManageProductForm> = () => {
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<editSchemaType>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      productId: 0,
      productName: "",
      description: "",
      price: 0,
      status: 1,
      image: "",
      category: {
        categoryId: 0,
      },
      brand: {
        brandId: 0,
      },
    },
  });

  const onSubmit = async (values: editSchemaType) => {
    try {
      await agent.Products.addMilk(values);
      navigate("/admin/milk");
      toast({
        title: "Create new Product successfully!",
      });
    } catch (error: any) {
      if (error.response) {
        // setToastMessage(error.response.data.message || "An error occurred");
        console.error("Error adding product:", error.response.data);
      } else {
        const errorMessage =
          error.response?.data?.message || "An error occurred";
        toast({
          title: errorMessage,
        });
        console.error("Error adding product:", error);
      }
    }
  };

  return (
    <Layout>
   

      <Layout.Body>
        <div className="mt-2">
          <Heading
            title={"Create new product"}
            description={"Add a new product"}
          />
        </div>
        <Separator />
        <div className="py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 w-full"
            >
              <div className="md:grid md:grid-cols-3 gap-8">
                <FormField
                  control={form.control}
                  name="productName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product name</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Status to Update" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {statuses.map((status, index) => (
                              <SelectItem key={index} value={status.value}>
                                <span className="flex items-center">
                                  <status.icon className="mr-2 h-5 w-5 text-muted-foreground" />
                                  {status.label}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category.categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="brand.brandId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="ml-auto">
                Create
              </Button>
            </form>
          </Form>
        </div>
      </Layout.Body>
    </Layout>
  );
};
