import { useState, useEffect } from "react";
import { columns } from "./components/columns";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/DataTable/data-table";
import { Layout } from "@/components/custom/layout";
import { Search } from "@/components/search";
import ThemeSwitch from "@/components/theme-switch";
import { UserNav } from "@/components/user-nav";
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
        setData(result.content); // Assuming the data is in the `content` field of the response
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

        <Button onClick={() => navigate("/admin/newMilk")}>
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
// <Layout>
//   {/* ===== Top Heading ===== */}
//   <Layout.Header sticky>
//     <div className="ml-auto flex items-center space-x-4">
//       <ThemeSwitch />
//       <UserNav />
//     </div>
//   </Layout.Header>

//   <Layout.Body>
{
  /* </Layout.Body>
    </Layout> */
}
