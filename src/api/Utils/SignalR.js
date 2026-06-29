import * as signalR from '@microsoft/signalr';
import { baseApi } from "@/api";

const accessToken = baseApi.endpoints.login.select().data?.returnData?.token;

const connection = () =>
	// eslint-disable-next-line implicit-arrow-linebreak
	new signalR.HubConnectionBuilder()
		.withUrl(process.env.EXPO_PUBLIC_SIGNALR_URL, {
			accessTokenFactory: () => accessToken,
			transport: signalR.HttpTransportType.WebSockets || signalR.HttpTransportType.LongPolling,
		})
		.withAutomaticReconnect()
		.build();

export default connection;
