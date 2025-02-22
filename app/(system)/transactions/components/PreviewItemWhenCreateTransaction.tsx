import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { productsDataType } from "@/hooks/UseTransAction";
import { Pencil, Trash2 } from "lucide-react";
import { memo } from "react";

const PreviewItemWhenCreateTransaction = ({
  products,
  editingId,
  handleSave,
  handleDelete,
  handleEdit,
  handleEditeType
}: {
  products: productsDataType[];
  editingId: number | null;
  handleSave: (id: number, field: "price" | "amount", value: string) => void;
  handleDelete: (id: number) => void;
  handleEdit: (id: number) => void;
  handleEditeType: (id: number, value: string) => void
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">الاسم</TableHead>
          <TableHead className="text-center">السعر</TableHead>
          <TableHead className="text-center">الكمية</TableHead>
          <TableHead className="text-center">نوع</TableHead>
          <TableHead className="text-center">الإجراءات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.length > 0 ? (
          products.map((product: productsDataType) => (
            <TableRow className="h-fit" key={product.id}>
              <TableCell className="text-center">{product.title}</TableCell>
              <TableCell className="text-center">
                {editingId === product.id ? (
                  <Input
                    type="number"
                    defaultValue={product.price}
                    onBlur={(e) =>
                      handleSave(product.id, "price", e.target.value)
                    }
                    className="text-center"
                  />
                ) : (
                  `${product.price.toFixed(2)} جنيه`
                )}
              </TableCell>
              <TableCell className="text-center">
                {editingId === product.id ? (
                  <Input
                    type="number"
                    defaultValue={product.amount}
                    onBlur={(e) =>
                      handleSave(product.id, "amount", e.target.value)
                    }
                    className="text-center"
                  />
                ) : (
                  product.amount
                )}
              </TableCell>
              <TableCell className="text-center">
                {editingId === product.id ? (
                  <Select dir="rtl" defaultValue={product.type} onValueChange={(value: string) => handleEditeType(product.id, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر حالة " />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="فارغ">فارغ</SelectItem>
                      <SelectItem value="ممتلئ">ممتلئ</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  product.type
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2 justify-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(product.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center">
              لايوجد أصناف مضافه .
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default memo(PreviewItemWhenCreateTransaction);
