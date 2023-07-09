import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dispatch, useAppSelector } from "~/config/store";
import {
	useGetSessionsByDateMutation,
	handleReadOnlySession,
	getReadonlySession,
	setCalenderCurrentView,
	setCalenderCurrentDate
} from "~/features/training/store";
import { Icon } from "@iconify/react";
import { styled } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
	Scheduler,
	WeekView,
	DayView,
	MonthView,
	Appointments,
	Toolbar,
	DateNavigator,
	ViewSwitcher,
	TodayButton
} from "@devexpress/dx-react-scheduler-material-ui";
import ReadOnlySession from "./ReadOnlySession";
import { navigateLink } from "~/config/api/links";
import { useLocation, useNavigate } from "react-router-dom";

const PREFIX = "Demo";
const classes = {
	toolbarRoot: `${PREFIX}-toolbarRoot`,
	progress: `${PREFIX}-progress`
};

const StyledDiv = styled("div")({
	[`&.${classes.toolbarRoot}`]: {
		position: "relative"
	}
});

const StyledLinearProgress = styled(LinearProgress)(() => ({
	[`&.${classes.progress}`]: {
		position: "absolute",
		width: "100%",
		bottom: 0,
		left: 0
	}
}));

const ToolbarWithLoading = ({ children, ...restProps }: any) => (
	<StyledDiv className={classes.toolbarRoot}>
		<Toolbar.Root {...restProps}>{children}</Toolbar.Root>
		<StyledLinearProgress className={classes.progress} />
	</StyledDiv>
);

const mapAppointmentData = (appointment: any) => {
	return {
		id: appointment.TrainingSessionID,
		startDate: appointment.StartDateTime,
		endDate: appointment.EndDateTime,
		title: appointment.Name
	};
};

const ExternalViewSwitcher = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const { CalenderCurrentView } = useAppSelector((state: any) => state.instructor);

	const currentViewNameChange = (val: any) => {
		if (val === "Day") {
			navigate(navigateLink.training, { state: "TrainingMeet" });
		}
		dispatch(setCalenderCurrentView(val));
	};

	const changCurrentDate = () => {
		dispatch(setCalenderCurrentDate(new Date()));
	};
	const currentBg = "bg-[#1268B3] text-[#ffffff] shadow";

	useEffect(() => {
		const scrollToDiv = document.getElementById("upcomingMeet");
		if (location.state === "TrainingMeet") scrollToDiv?.scrollIntoView();
	}, []);

	return (
		<>
			<div>
				<div className="w-full flex justify-end">
					<div className="rounded-lg text-slate-600 bg-[#ffffff] shadow flex mr-1 sm:mr-0">
						<button
							onClick={() => currentViewNameChange("Month")}
							className={`btn shrink-0 px-3 py-1 text-sm font-medium ${
								CalenderCurrentView == "Month" && currentBg
							}`}
						>
							Month
						</button>
						<button
							onClick={() => currentViewNameChange("Day")}
							className={`btn shrink-0 px-3 py-1 text-sm font-medium ${
								CalenderCurrentView == "Day" && currentBg
							}`}
						>
							Day
						</button>
						<button
							onClick={() => currentViewNameChange("Week")}
							className={`btn shrink-0 px-3 py-1 text-sm font-medium ${
								CalenderCurrentView == "Week" && currentBg
							}`}
						>
							Week
						</button>
					</div>
				</div>
				{/* 				<div className="flex"> */}
				{/* 					<button */}
				{/* 						onClick={() => changCurrentDate()} */}
				{/* 						className={`btn shrink-0 px-3 py-1 text-sm font-medium bg-[#ffffff] text-[#000000] shadow`} */}
				{/* 					> */}
				{/* 						Today */}
				{/* 					</button> */}
				{/* 				</div> */}
			</div>
		</>
	);
};

const AppointmentComp = ({ children, style, ...restProps }: any) => {
	const dispatch = useDispatch();
	const showDetailScreen = () => {
		dispatch(handleReadOnlySession(restProps.data));
	};
	return (
		<Appointments.Appointment {...restProps} onClick={() => showDetailScreen()}>
			<div title={restProps.data.title} id="upcomingMeet">
				{children}
			</div>
		</Appointments.Appointment>
	);
};

const FlexibleSpace = () => {
	return <ExternalViewSwitcher />;
};

export default () => {
	const { CalenderCurrentView, CalenderCurrentDate } = useAppSelector((state: any) => state.instructor);
	const [data, setData] = useState([]);
	const [getSessionsByDate, getSessionsByDateOption] = useGetSessionsByDateMutation();
	const [loading, setLoading] = useState(false);
	const [currentViewName, setCurrentViewName] = useState("Month");
	const [currentDate, setCurrentDate] = useState(new Date());
	const sessionState = useSelector(getReadonlySession);

	function loadData() {
		setLoading(true);
		const dateString = currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate();
		getSessionsByDate(dateString)
			.unwrap()
			.then(data => {
				setLoading(false);
				setData(data.Data.map(mapAppointmentData));
			})
			.catch(err => {
				setLoading(false);
			});
	}

	// 	useEffect(() => {
	// 		console.log("Inside Current Date");
	// 		loadData();
	// 	}, [currentDate]);

	// 	useEffect(() => {
	// 		if (CalenderCurrentDate) {
	// 			setCurrentViewName("Day");
	// 			setCurrentDate(CalenderCurrentDate);
	// 		}
	// 	}, [CalenderCurrentDate]);

	useEffect(() => {
		if (CalenderCurrentView) {
			setCurrentViewName(CalenderCurrentView);
		}
		loadData();
	}, [CalenderCurrentView, currentDate]);

	return (
		<>
			<div className="training-scheduler">
				{sessionState?.id && <ReadOnlySession sessionId={sessionState.id} reload={loadData} />}
				<Scheduler data={data} height={660}>
					<ViewState
						defaultCurrentDate={new Date()}
						currentViewName={currentViewName}
						onCurrentViewNameChange={setCurrentViewName}
						onCurrentDateChange={setCurrentDate}
					/>
					<DayView cellDuration={60} />
					<WeekView cellDuration={60} />
					<MonthView />
					<Appointments appointmentComponent={AppointmentComp} />
					<Toolbar
						{...(loading ? { rootComponent: ToolbarWithLoading } : null)}
						flexibleSpaceComponent={FlexibleSpace}
					/>
					<DateNavigator />
					<TodayButton />
				</Scheduler>
			</div>
		</>
	);
};
