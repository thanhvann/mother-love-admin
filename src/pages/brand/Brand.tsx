/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { columns } from "./components/columns";
import axios from "axios";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/DataTable/data-table";
import { CategoryObj } from "@/models/Category";
import agent from "@/api/agent";
import { BrandObj } from "@/models/Brand";

export const Brand = () => {
  const [data, setData] = useState<BrandObj[]>([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("brandId");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [totalRows, setTotalRows] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await agent.Brand.list(pageNo, pageSize);
        setData(result.content); // Assuming the data is in the `data` field of the response
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
          title={`Brand (${Object.keys(data).length})`}
          description="Manage Brand in the shop"
        />

        <Button onClick={() => navigate("/admin/newBrand", { state: null })}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <DataTable columns={columns} data={data} searchKey="brandName" />
      </div>
    </>
  );
};
