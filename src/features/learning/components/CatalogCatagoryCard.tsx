import { useDispatch } from "react-redux";
import { MasterCourseCategoryType } from "../@types";
import { setSelectedCatagoryID } from "../store/slice";

interface IProps {
	masterCourseCategory: MasterCourseCategoryType;
	setLearningCoursesShow: any;
}

function CatalogCatagoryCard({ masterCourseCategory, setLearningCoursesShow }: IProps) {
	/*const imageUrl = import.meta.env.VITE_APP_IMG_URL;*/
	const dispatch = useDispatch();

	const handleCategoryClick = (event: any, CatalogCategoryID: number) => {
		setLearningCoursesShow(CatalogCategoryID);
		dispatch(setSelectedCatagoryID(+event.target.id?.split("-")[0]));
	};

	return (
		<button
			className="bg-white"
			key={masterCourseCategory?.CategoryID}
			onClick={(event: any) => handleCategoryClick(event, masterCourseCategory?.CatalogCategoryID)}
		>
			<div
				id={masterCourseCategory?.CategoryID + "-" + masterCourseCategory?.CatalogCategoryID}
				className="m-2 rounded-lg border border-gray-200 flex flex-col"
			>
				{/*<img src={imageUrl + masterCourseCategory.CategoryImageFileName} alt="" className="w-full h-36" /> */}
				<img
					src={"assets/images/sample_learn.png"}
					alt=""
					id={masterCourseCategory?.CategoryID + "-" + masterCourseCategory?.CatalogCategoryID}
					className="w-full h-36"
				/>
			</div>
			<div className="text-center my-4">{masterCourseCategory?.CategoryName}</div>
		</button>
	);
}

export default CatalogCatagoryCard;
