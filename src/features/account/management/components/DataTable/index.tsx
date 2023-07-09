import React, { useState, useEffect } from "react";
import { useTable } from "react-table";
import Pagination from "./Pagination";

function DataTable(props: any) {
	const { columns, data, fetchData, pageSize, TotalItems } = props;
	const [currentPage, setCurrentPage] = useState(1);
	const [currentPageSize, setCurrentPageSize] = useState(pageSize || 10);

	const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
		columns,
		data
	});

	useEffect(() => {
		fetchData({
			PageSize: currentPageSize,
			PageNumber: currentPage
		});
		//eslint-disable-next-line
	}, [currentPage, currentPageSize]);

	return (
		<>
			<div className="is-scrollbar-hidden mb-2 min-w-full overflow-x-auto  rounded-lg">
				<table className="is-hoverable w-full text-left" {...getTableProps()}>
					<thead>
						{headerGroups.map(headerGroup => (
							<tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map(column => (
									<th
										className="whitespace-nowrap bg-slate-200 px-4 py-3 uppercase text-slate-800 text-sm+ font-semibold"
										{...column.getHeaderProps()}
									>
										{column.render("Header")}
									</th>
								))}
							</tr>
						))}
					</thead>
					<tbody {...getTableBodyProps()} className={"bg-white w-full"}>
						{data.length === 0 && (
							<tr>
								<td colSpan={columns.length} className="py-5 text-center">
									<div className="flex flex-col text-center items-center mx-auto py-20">
										<img
											className="h-40 my-auto"
											src="/assets/images/Tiger_images/tiger-logoutX400.png"
										/>
										<p className="text-xs+ text-[#020A12]/60">{"No Data"}</p>
									</div>
								</td>
							</tr>
						)}
						{data.length !== 0 &&
							rows.map((row, i) => {
								prepareRow(row);
								return (
									<tr
										className="border-y border-transparent border-b-slate-200 "
										{...row.getRowProps()}
									>
										{row.cells.map(cell => {
											return (
												<td
													className="whitespace-nowrap px-4 py-3 sm:px-5"
													{...cell.getCellProps()}
												>
													{cell.render("Cell")}
												</td>
											);
										})}
									</tr>
								);
							})}
					</tbody>
				</table>
			</div>
			{/* {TotalItems > currentPageSize && ( */}
			<div className="bg-white">
				<Pagination
					className="pagination-bar"
					currentPage={currentPage}
					totalCount={TotalItems}
					pageSize={currentPageSize}
					onPageSizeChange={(size: number) => {
						setCurrentPageSize(size);
						setCurrentPage(1);
					}}
					onPageChange={(page: number) => setCurrentPage(page)}
					isItemsCenter
				/>
			</div>
			{/* )} */}
		</>
	);
}

export default DataTable;
