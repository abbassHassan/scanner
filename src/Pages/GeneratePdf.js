import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";
import generatePDF from "react-to-pdf";
import { db } from "../Firebase"; // adjust the path accordingly

const GeneratePdf = () => {
  const targetRef = useRef();
  const [searchParams] = useSearchParams();
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    const fetchOrderItems = async () => {
      const orderId = searchParams.get("id");
      if (orderId) {
        const q = query(
          collection(db, "order_items"),
          where("order", "==", doc(db, "orders", orderId))
        );

        const querySnapshot = await getDocs(q);
        const items = await Promise.all(
          querySnapshot.docs.map(async (orderItemDoc) => {
            const orderItemData = orderItemDoc.data();
            const productDoc = await getDoc(orderItemData.product);
            const productData = productDoc.data();
            return { ...orderItemData, productData };
          })
        );
        setOrderItems(items);
      }
    };

    fetchOrderItems();
  }, [searchParams]);

  return (
    <div className=" overflow-x-hidden">
      <div className="flex items-center justify-center flex-col">
        <button
          onClick={() => generatePDF(targetRef, { filename: "order.pdf" })}
          className="bg-blue-500 text-white py-2 px-4 rounded m-4"
        >
          Download PDF
        </button>
        <div
          ref={targetRef}
          className="w-[1080px] flex flex-col justify-start items-center p-4 border border-gray-300 shadow-lg"
        >
          <h1 className="text-2xl font-bold mb-4">Order Items</h1>
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Product</th>
                <th className="border border-gray-300 px-4 py-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.productData.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GeneratePdf;
