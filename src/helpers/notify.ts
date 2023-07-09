import toast from "react-hot-toast";

export function notify(id: string, data: any) {
	console.warn("We got a rejected action!", data);
	const message = data?.Message || data?.message || data?.title || "Something Went Wrong. Try Again";
	toast.error(message, { id });
}
