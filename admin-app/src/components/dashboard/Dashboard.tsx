import { Col, Empty, Row } from 'antd';
import axios from 'axios';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { ARRAY_DATA, NOTIFICATION_TYPES, STATUS_CODES } from '../../constants/common';
import { getAccessToken, removeAccessToken, showNotificationMessage } from '../../helpers';
import * as routes from '../../constants/routes';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ASSIGNED_TICKETS, TICKETS_STATUS, TICKETS_TIME_TAKEN } from '../../constants/dashboard';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        }
    },
    scales: {
        yAxis: {
            ticks: {
                precision: 0
            }
        }
    }
};

const Dashboard = () => {
    const navigate = useNavigate();

    const [ticketsStatusData, setTicketsStatusData] = useState<any>(null)
    const [averageTimeTakenData, setAverageTimeTakenData] = useState<any>(null)
    const [assignedTicketsData, setAssignedTicketsData] = useState<any>(null)

    useEffect(() => {
        getDashboardChartsData()
    }, [])

    const getDashboardChartsData = async () => {
        const token: any = await getAccessToken()
        axios.get(`${process.env.REACT_APP_API_BASE_URL}dashboard-charts`, {
            headers: {
                'content-type': 'application/json',
                'accessToken': token
            }
        })
            .then(async (res) => {
                if (res?.data) {
                    if (res.data.ticketsStatusData.length)
                        setTicketsStatusData({
                            labels: res.data.ticketsStatusData.map((ele: TICKETS_STATUS) => ele.status),
                            datasets: [
                                {
                                    label: 'Tickets Status',
                                    data: res.data.ticketsStatusData.map((ele: TICKETS_STATUS) => ele.count),
                                    backgroundColor: [
                                        'rgba(255, 99, 132, 0.2)',
                                        'rgba(54, 162, 235, 0.2)',
                                        'rgba(255, 206, 86, 0.2)'
                                    ],
                                    borderColor: [
                                        'rgba(255, 99, 132, 1)',
                                        'rgba(54, 162, 235, 1)',
                                        'rgba(255, 206, 86, 1)',
                                    ],
                                    borderWidth: 1
                                }
                            ]
                        })
                    else setTicketsStatusData(null)

                    if (res.data.assignedTickets.length)
                        setAverageTimeTakenData({
                            labels: res.data.assignedTickets.map((ele: ASSIGNED_TICKETS) => ele.name),
                            datasets: [
                                {
                                    label: 'In Progress',
                                    data: res.data.assignedTickets.map((ele: ASSIGNED_TICKETS) => ele.inProgress),
                                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                },
                                {
                                    label: 'Closed',
                                    data: res.data.assignedTickets.map((ele: ASSIGNED_TICKETS) => ele.closed),
                                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                                }
                            ]
                        })
                    else setAverageTimeTakenData(null)

                    if (res.data.TicketsTakenTime.length) {
                        const filteredData: ARRAY_DATA[] = []
                        res.data.TicketsTakenTime.map((ele: TICKETS_TIME_TAKEN) => {
                            ele.assignedTickets.length &&
                                filteredData.push({
                                    name: ele.name,
                                    value: ele?.assignedTickets?.reduce((total: number, next: any) => total + next.timeTaken, 0) / ele?.assignedTickets.length
                                })
                        })
                        setAssignedTicketsData({
                            labels: filteredData.map((ele: ARRAY_DATA) => ele.name),
                            datasets: [
                                {
                                    label: 'Average Time in Hours',
                                    data: filteredData.map((ele: ARRAY_DATA) => ele.value),
                                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                }
                            ],
                        })
                    } else setAssignedTicketsData(null)
                } else {
                    setTicketsStatusData(null)
                }
            })
            .catch(async (err) => {
                if (err?.response?.status === STATUS_CODES.UN_AUTHORIZED || err?.response?.status === STATUS_CODES.FORBIDDEN) {
                    showNotificationMessage(NOTIFICATION_TYPES.ERROR, '')
                    await removeAccessToken()
                    navigate(routes.LOGIN)
                } else showNotificationMessage(NOTIFICATION_TYPES.ERROR, err?.response?.data?.message)
            });
    }

    return <div className="dashboard">
        <h1>Dashboard</h1>
        <Row gutter={[16, 16]} className="charts">
            <Col span={8}>
                <h1 style={{ textAlign: 'center' }}>Tickets Status</h1>
                {
                    ticketsStatusData
                        ? <Pie data={ticketsStatusData} />
                        : <div className="center-no-data">
                            <h4>No Data</h4>
                        </div>
                }
            </Col>
            <Col span={16}>
                <h1 style={{ textAlign: 'center' }}>Average Time Taken by Operation Manager To Complete Tickets</h1>
                {
                    assignedTicketsData
                        ? <Bar options={options} data={assignedTicketsData} />
                        : <div className="center-no-data">
                            <h4>No Data</h4>
                        </div>
                }
            </Col>
        </Row>
        <Row gutter={[32, 32]} className="charts">
            <Col span={24}>
                <h1 style={{ textAlign: 'center' }}>Assigned Tickets Count</h1>
                {
                    averageTimeTakenData
                        ? <Bar height={'100px'} options={options} data={averageTimeTakenData} />
                        : <div className="center-no-data">
                            <h4>No Data</h4>
                        </div>
                }
            </Col>
        </Row>
    </div>
}

export default Dashboard