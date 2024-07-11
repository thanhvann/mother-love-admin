/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { columns } from "./components/columns";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/DataTable/data-table";
import agent from "@/api/agent";
import { ProductsObj } from "@/models/Product";

export const Products = () => {
  const [data, setData] = useState<ProductsObj[]>([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("productId");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await agent.Products.list(pageNo, pageSize);
        const cleanedData = result.content.map((product: ProductsObj) => {
          if (typeof product.image === "string") {
            // Remove brackets and split the string into an array
            const imageString = product.image as string;
            const cleanedImage = imageString.replace(/[\[\]]/g, "").split(",");
            return { ...product, image: cleanedImage };
          }
          return product;
        });
        setData(cleanedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getData();
  }, [pageNo, pageSize, sortBy, sortDir]);

  return (
    <>
      <div className="flex items-center justify-between pt-4">
        <Heading
          title={`Product (${data.length})`}
          description="Manage Product in the shop"
        />

        <Button onClick={() => navigate("/admin/newMilk", { state: null })}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <DataTable columns={columns} data={data} searchKey="productName" />
      </div>
    </>
  );
};
