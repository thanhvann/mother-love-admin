import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import agent from "@/api/agent";
import { useToast } from "@/components/ui/use-toast";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ImageUpload from "@/components/image-upload";

interface ManageBlogForm {}

interface User {
  userId: number;
  fullName: string;
}
interface Product {
  productId: number;
  productName: string;
}
const editSchema = z.object({
  image: z.string().optional(),
  title: z.string().min(1, { message: "Title is required!" }),
  content: z.string().nullable(),
  user: z.object({
    fullName: z.string().min(1, { message: "Author is required!" }),
  }),
  product: z
    .array(
      z.object({
        productName: z.string().min(1, { message: "Product is required!" }),
      })
    )
    .nonempty({ message: "At least one product is required" }),
});

type editSchemaType = z.infer<typeof editSchema>;

export const AddBlog: React.FC<ManageBlogForm> = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = location.state || null;
  const [openProductComboBox, setOpenProductComboBox] = useState(false);
  const [openUserComboBox, setOpenUserComboBox] = useState(false);
  const [user, setUser] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [htmlPreview, setHtmlPreview] = useState<string>("");
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const getProducts = async () => {
      try {
        await agent.Products.list(pageNo, pageSize).then((response) => {
          if (response.content && Array.isArray(response.content)) {
            setProducts(response.content);
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getProducts();
  }, []);

  const form = useForm<editSchemaType>({
    resolver: zodResolver(editSchema),
    defaultValues: initialData || {
      title: "",
      image: "",
      content: "",
      user: {
        fullName: "",
      },
      product: [
        {
          productName: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "product",
  });

  useEffect(() => {
    if (initialData) {
      // If editing existing blog, set initial values for preview
      setHtmlPreview(initialData.content);
    }
  }, [initialData]);

  async function onSubmit(values: editSchemaType) {
    try {
      console.log("submit", values);

      if (initialData) {
        await agent.Blog.updateBlog({ ...values }); // Assuming updateBlog method exists
        toast({
          title: "Blog updated successfully!",
        });
      } else {
        await agent.Blog.addBlog(values);
        toast({
          title: "Create new Blog successfully!",
        });
      }
      navigate("/admin/blog");
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast({
        title: errorMessage,
      });
      console.error("Error creating/updating blog:", error);
    }
  }
  // const handleImageUpload = (url: string) => {
  //   const currentValue = form.getValues("image") || [];
  //   if (!currentValue.includes(url)) {
  //     form.setValue("image", [...currentValue, url]);
  //   }
  // };

  // const handleImageRemove = (url: string) => {
  //   const currentValue = form.getValues("image") || [];
  //   form.setValue(
  //     "image",
  //     currentValue.filter((v) => v !== url)
  //   );
  // };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mt-2">
        <Heading
          title={initialData ? "Edit blog" : "Create new blog"}
          description={"Manage blog content"}
        />
      </div>
      <Separator />
      <div className="py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="h-full row-span-2">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <CKEditor
                          editor={ClassicEditor}
                          data={field.value}
                          onChange={(_, editor) => {
                            const data = editor.getData();
                            field.onChange(data);
                            setHtmlPreview(data); // Update HTML preview state
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <div>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thumbnail Image</FormLabel>
                        <FormControl>
                          <ImageUpload
                            value={field.value ? [field.value] : []}
                            onChange={(url) => field.onChange(url)}
                            onRemove={() => field.onChange("")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* <FormField
                    control={form.control}
                    name="createdDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Created Date</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Created Date"
                            {...field}
                            readOnly
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastModifiedDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Modified Date</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Last Modified Date"
                            {...field}
                            readOnly
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                  <FormField
                    control={form.control}
                    name="user.fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Author</FormLabel>
                        <FormControl>
                          <Input placeholder="Author" {...field} readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.map((item, index) => (
                    <div key={item.id} className="mt-2">
                      <FormField
                        control={form.control}
                        name={`product.${index}.productName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product {index + 1}</FormLabel>
                            <FormControl>
                              <Input placeholder="Product" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        variant="destructive"
                        type="button"
                        onClick={() => remove(index)}
                      >
                        Remove Product
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() =>
                      append({
                        productName: "",
                      })
                    }
                    className="mt-2"
                  >
                    Add Product
                  </Button>
                  <h2 className="text-lg font-semibold mb-2">HTML Preview</h2>
                  <div
                    className="border rounded p-4"
                    dangerouslySetInnerHTML={{ __html: htmlPreview }}
                  />
                </div>
              </div>
            </div>
            <Button type="submit" className="ml-auto col-span-2">
              {initialData ? "Update" : "Create"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
