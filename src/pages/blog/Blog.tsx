import { useState, useEffect } from "react";
import { columns } from "./components/columns";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Heading } from "@/components/ui/heading";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/DataTable/data-table";
import agent from "@/api/agent";
import { BlogObj } from "@/models/Blog";

export const Blog = () => {
  const [data, setData] = useState<BlogObj[]>([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("categoryId");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();

  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    return date.toLocaleString("en-US", options);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await agent.Blog.list(pageNo, pageSize);
        const formattedData = result.content.map((item: BlogObj) => {
          return {
            ...item,
            createdDate: formatDate(item.createdDate), // Format as desired
            lastModifiedDate: formatDate(item.lastModifiedDate),
          };
        });

        setData(formattedData); // Assuming the data is in the `data` field of the response
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
          title={`Blog (${Object.keys(data).length})`}
          description="Manage Blog in the shop"
        />

        <Button onClick={() => navigate("/admin/newBlog", { state: null })}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <DataTable columns={columns} data={data} searchKey="title" />
      </div>
    </>
  );
};
