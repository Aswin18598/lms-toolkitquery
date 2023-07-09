import { generatePath } from "react-router-dom";
import { api } from "~/config/api";
import { endPoints } from "~/config/api/endPoints";
import { getLoggedUser } from "~/helpers/auth";

export enum PageName {
	UserNotification = "UserNotification",
	BusinessProfile = "BusinessProfile",
	PersonalProfile = "PersonalProfile"
}

export const UserUpdateProfileApi = api.injectEndpoints({
	endpoints: builder => ({
		getProfile: builder.query<any, PageName>({
			query: pageName => {
				const user = getLoggedUser();
				return { url: generatePath(endPoints.account.profile.get, { pageName, userID: user.UserId }) };
			}
		}),
		getBusinessManager: builder.query<any, void>({
			query: () => {
				const user = getLoggedUser();
				return { url: generatePath(endPoints.account.businessManager, { userID: user.UserId }) };
			}
		}),
		getIndustryInfo: builder.query<any, void>({
			query: () => ({ url: endPoints.account.IndustryInfo })
		}),
		getCadApplicationList: builder.query<any, void>({
			query: () => ({ url: endPoints.account.cadApplicationList })
		}),
		getCountryList: builder.query<any, void>({
			query: () => ({ url: endPoints.common.countryList })
		}),
		getUserGroups: builder.query<any, void>({
			query: () => {
				const { UserId } = getLoggedUser();
				return { url: generatePath(endPoints.account.userGroups, { UserId }) };
			}
		}),
		getCountryStateList: builder.mutation<any, { regionId: string }>({
			query: ({ regionId }) => ({ url: generatePath(endPoints.common.stateList, { regionId }) })
		}),
		updateProfile: builder.mutation<any, { pageName: PageName; body: any }>({
			query: ({ pageName, body }) => ({
				url: generatePath(endPoints.account.profile.update, { pageName: `${pageName}Update` }),
				method: "POST",
				body
			})
		}),
		updatePassword: builder.mutation<any, any>({
			query: body => ({
				url: endPoints.account.updatePassword,
				method: "POST",
				body
			})
		})
	})
});
