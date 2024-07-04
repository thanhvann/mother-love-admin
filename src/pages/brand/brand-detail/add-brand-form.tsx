import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import agent from "@/api/agent";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/image-upload";

const editSchema = z.object({
  brandName: z.string().min(1, { message: "Brand Name Required" }),
  image: z.array(z.string()).optional(),
});

type editSchemaType = z.infer<typeof editSchema>;

export const AddBrand: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<editSchemaType>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      brandName: "",
      image: [],
    },
  });

  const onSubmit = async (values: editSchemaType) => {
    try {
      console.log("Submitted values:", values);

      // Check if values.image is defined and has at least one element
      if (values.image && values.image.length > 0) {
        await agent.Brand.addBrand({
          brandName: values.brandName,
          image: values.image[0], // Assuming your API expects a single image URL
        });
      } else {
        console.log("Image is required!");
        return; // Exit early if image is not defined or empty
      }

      toast({
        title: "Create new Brand successfully!",
      });
      navigate("/admin/brand");
    } catch (error: any) {
      if (error.response) {
        console.error("Error creating Brand:", error.response.data);
      } else {
        const errorMessage =
          error.response?.data?.message || "An error occurred";
        toast({
          title: errorMessage,
        });
        console.error("Error creating Brand:", error);
      }
    }
  };

  const handleImageUpload = (url: string) => {
    const currentValue = form.getValues("image") || [];
    if (!currentValue.includes(url)) {
      form.setValue("image", [...currentValue, url]);
    }
  };

  const handleImageRemove = (url: string) => {
    const currentValue = form.getValues("image") || [];
    form.setValue(
      "image",
      currentValue.filter((v) => v !== url)
    );
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="brandName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand name</FormLabel>
                <Input type="text" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <ImageUpload
                  value={field.value || []}
                  onChange={handleImageUpload}
                  onRemove={handleImageRemove}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Create</Button>
        </form>
      </Form>
    </div>
  );
};
