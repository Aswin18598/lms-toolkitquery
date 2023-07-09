export const profileMenus = [
	{ path: "/account/update/personal", name: "Personal Profile", icon: "mingcute:user-4-line" },
	{ path: "/account/update/business", name: "Business Profile", icon: "mingcute:briefcase-line" },
	{ path: "/account/update/role-and-skill", name: "Role & Competency Mapping", icon: "mingcute:target-line" },
	{
		path: "/account/update/privacy-and-security",
		name: "Privacy and Security",
		icon: "mingcute:safety-certificate-line"
	},
	// { path: "account-sttings", name: "Account Settings", icon: "mingcute:profile-line" },
	{ path: "/account/update/notification-settings", name: "Notification Settings", icon: "mingcute:notification-line" }
];

export const learningMenus = [
	{ path: "/learning?MyLearning-1", name: "My Learning" },
	{ path: "/learning?LearningPaths", name: "Learning Paths" },
	{ path: "/learning?History", name: "History" },
	{ path: "/learning?Catalog", name: "Catalog" }
];

export const accountMenus = [
	{ name: "Dashboard", path: "/account/management" },
	{ name: "Assigned Learning", path: "/account/management/learning-path" },
	{ name: "Roles", path: "/account/management/roles" },
	{ name: "Competency", path: "/account/management/competency" },
	{ name: "Role Structure", path: "/account/management/role-structure" },
	{ name: "User Administration", path: "/account/management/user-administration" }
];

export const ILTMenus = [
	{ name: "Training", path: "/training" },
	{ name: "Report", path: "/training/report" }
];

export const authorMenus = [
	{ name: "Dashboard", path: "/author/management" },
	{ name: "Rapid Authoring Tool", path: "/rapid-authoring-tool" },
	{ name: "Course Detail Report", path: "/author/management/course-detail-report" }
];
