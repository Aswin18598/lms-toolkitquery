import { useEffect } from "react";
import { setSelectedTypeID, useGetCategoriesListQuery, useGetCategoryListQuery } from "~/features/learning/store";
import { Spinner } from "~/components/spinner";
import CatalogCourses from "./CatalogCourses";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { getLoggedUser } from "~/helpers/auth";

function LearningCatalog() {
	const { UserId } = getLoggedUser();
	const dispatch = useDispatch();
	const location = useLocation();
	const typeId = +location.search?.split("-")[1];
	useEffect(() => {
		dispatch(setSelectedTypeID(typeId === 2 ? 2 : 1));
	}, [typeId]);
	const { isLoading } = useGetCategoriesListQuery("");
	useGetCategoryListQuery(UserId);
	return (
		<>
			{isLoading && (
				<div className="mx-auto my-32">
					<Spinner />
				</div>
			)}
			{!isLoading && <CatalogCourses />}
		</>
	);
}

export default LearningCatalog;
