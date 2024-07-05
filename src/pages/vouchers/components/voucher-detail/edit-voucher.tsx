import React from "react";
import { z } from "zod";
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
import { useToast } from "@/components/ui/use-toast";
import agent from "@/api/agent";
import { VoucherObj } from "@/models/Voucher";
import { voucherSchema } from "@/schema/voucherSchema";

interface EditVoucherDialogProps {
  voucher: VoucherObj;
  onClose: () => void;
  onEditSuccess: () => void;
}

type VoucherSchemaType = z.infer<typeof voucherSchema>;

const EditVoucherDialog: React.FC<EditVoucherDialogProps> = ({
  voucher,
  onClose,
  onEditSuccess,
}) => {
  const { toast } = useToast();
  const form = useForm<VoucherSchemaType>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      voucherId: voucher.voucherId,
      voucherCode: voucher.voucherCode,
      voucherName: voucher.voucherName,
      quantity: voucher.quantity,
      quantityUse: voucher.quantityUse,
      discount: voucher.discount,
      minOrderAmount: voucher.minOrderAmount,
      startDate: voucher.startDate.substring(0, 10),
      endDate: voucher.endDate.substring(0, 10),
      status: voucher.status ? "ACTIVE" : "INACTIVE",
    },
  });

  const onSubmit = async (values: VoucherSchemaType) => {
    const startDateTime = `${values.startDate}T00:00:00.000Z`;
    const endDateTime = `${values.endDate}T23:59:59.999Z`;
    const updatedValues = {
      ...values,
      startDate: startDateTime,
      endDate: endDateTime,
    };

    try {
      await agent.Voucher.updateVoucher(updatedValues);
      toast({
        title: "Voucher updated successfully!",
      });
      onClose(); // Close the dialog after successful update
      onEditSuccess(); // Trigger onEditSuccess callback
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast({
        title: errorMessage,
      });
      console.error("Error updating voucher:", error);
    }
  };

  return (
    <div >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
          <FormField
            control={form.control}
            name="voucherCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Voucher Code</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="voucherName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Voucher Name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantityUse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity Use</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discount</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minOrderAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Min Order Amount</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={form.watch("startDate")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={form.watch("endDate")} />
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
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit and cancel buttons */}
          <div className="flex justify-end space-x-2">
            <Button type="submit">
              Update Voucher
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditVoucherDialog;
