import { MoreOutlined } from "@ant-design/icons";
import { Button, Col, Dropdown, Form, Menu, Modal, Row, Select, Table } from "antd"
import MenuItem from "antd/lib/menu/MenuItem";
import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

import { NOTIFICATION_TYPES, OPERATIONS_MANAGER, SELECT_OPTIONS, STATUS_CODES, UserTypes } from "../../constants/common";
import { STATUS, TICKETS_LIST, TOASTER_MESSAGES } from "../../constants/tickets"
import { getAccessToken, removeAccessToken, showNotificationMessage } from "../../helpers";
import * as routes from '../../constants/routes';
import moment from "moment";

const { Option } = Select;

const TicketsList = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm()
    const [userType, setUserType] = useState<UserTypes | null>(null)
    const [columns, setColumns] = useState<any>([])
    const [operationsManagerOptions, setOperationsManagerOptions] = useState<SELECT_OPTIONS[]>([])
    const [isModalOpen, setIsModalOpen] = useState({
        isOpen: false,
        ticketId: 0,
        ticketTitle: '',
        managerId: 0,
    })
    const [tickets, setTickets] = useState<TICKETS_LIST[]>([])

    const handleAssignToManager = async (id: number, title: string, managerId: number, loggeduserType: UserTypes) => {
        if (loggeduserType === UserTypes.Admin) {
            const token: any = await getAccessToken()
            axios.get(`${process.env.REACT_APP_API_BASE_URL}operation-managers`, {
                headers: {
                    'content-type': 'application/json',
                    'accessToken': token
                }
            })
                .then(res => {
                    if (res?.data) {
                        setOperationsManagerOptions([])
                        res.data.map((ele: OPERATIONS_MANAGER) => {
                            setOperationsManagerOptions((prevData: SELECT_OPTIONS[]) => [
                                ...prevData,
                                {
                                    id: ele.id,
                                    name: ele.name + ` (${ele.assignedTickets.length > 0 ? ele.assignedTickets.length + 'tickets are already in progress' : 'No ticket is in progress'})`
                                }
                            ])
                        })
                    } else {
                        setOperationsManagerOptions([])
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
        setIsModalOpen({
            isOpen: true,
            ticketId: id,
            ticketTitle: title,
            managerId
        })
        form.setFieldsValue({
            'assignedTo': managerId ? managerId : null
        })
    }

    const menu = (id: number, title: string, managerId: number, loggeduserType: UserTypes) => (
        <Menu className="user-menu-list">
            {loggeduserType === UserTypes.Admin && <MenuItem key={0} onClick={() => handleAssignToManager(id, title, managerId, loggeduserType)}>Assign to Operation Manager</MenuItem>}
            {loggeduserType === UserTypes.Operation_Manager && <MenuItem key={1} onClick={() => handleAssignToManager(id, title, managerId, loggeduserType)}>Close this ticket?</MenuItem>}
        </Menu>
    )

    useEffect(() => {
        const getData = async () => {
            const token: any = await getAccessToken()
            const decoded: any = await jwt_decode(token)
            setUserType(decoded.userType)
            getTicketsData()
            setColumns([
                {
                    key: 'title',
                    dataIndex: 'title',
                    title: 'Title',
                },
                {
                    key: 'description',
                    dataIndex: 'description',
                    title: 'Description',
                },
                {
                    key: 'client',
                    dataIndex: 'client',
                    title: 'Created By',
                    render: (client: { name: string }) => <div>{client?.name}</div>
                }
            ])
            if (decoded.userType === UserTypes.Admin) {
                setColumns((prevValue: any) => [...prevValue,
                {
                    key: 'operationsManager',
                    dataIndex: 'operationsManager',
                    title: 'Assigned To',
                    render: (operationsManager: any) => <div>{operationsManager && operationsManager.name}</div>
                }
                ])
            }
            setColumns((prevValue: any) => [...prevValue,
            {
                key: 'createdAt',
                dataIndex: 'createdAt',
                title: 'Created At',
                render: (createdAt: string) => (
                    <div>{moment(createdAt).format("MMMM Do YYYY, h:mm a")}</div>
                )
            },
            {
                key: 'status',
                dataIndex: 'status',
                title: 'Status',
                render: (text: string, record: any) =>
                    <>
                        <span>{text}</span>

                        {(text === STATUS.OPEN || text === STATUS.IN_PROGRESS) && <Dropdown className="menu-dropdown" overlay={menu(record.id, record.title, record?.operationsManager?.id, decoded.userType)}>
                            <a onClick={e => e.preventDefault()}>
                                <MoreOutlined />
                            </a>
                        </Dropdown>}
                    </>
            }])
        }

        getData()
    }, [])

    const getTicketsData = async () => {
        const token: any = await getAccessToken()
        axios.get(`${process.env.REACT_APP_API_BASE_URL}list-ticket`, {
            headers: {
                'content-type': 'application/json',
                'accessToken': token
            }
        })
            .then(res => {
                if (res?.data) {
                    setTickets([])
                    res.data.map((ele: TICKETS_LIST) => {
                        setTickets((prevData: TICKETS_LIST[]) => [
                            ...prevData,
                            {
                                key: ele.id,
                                ...ele
                            }
                        ])
                    })
                } else {
                    setTickets([])
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

    const handleModalClose = async () => {
        await form.resetFields()
        setIsModalOpen({
            isOpen: false,
            ticketId: 0,
            ticketTitle: '',
            managerId: 0
        })
    }

    const submitHandler = async () => {
        try {
            const values = await form.validateFields()
            const token: any = await getAccessToken()
            axios.post(`${process.env.REACT_APP_API_BASE_URL}assign-ticket`, { assignTo: values.assignedTo, ticketId: isModalOpen.ticketId }, {
                headers: {
                    'content-type': 'application/json',
                    'accessToken': token
                }
            })
                .then(async (res) => {
                    if (res?.data) {
                        showNotificationMessage(NOTIFICATION_TYPES.SUCCESS, TOASTER_MESSAGES.SUCCESS_ASSIGNED)
                        await form.resetFields()
                        setIsModalOpen({
                            isOpen: false,
                            ticketId: 0,
                            ticketTitle: '',
                            managerId: 0
                        })
                        await getTicketsData()
                    }
                })
                .catch((err) => {
                    showNotificationMessage(NOTIFICATION_TYPES.ERROR, err?.response?.data?.message)
                });
        } catch (error) {
            return error
        }
    }

    const handleCloseTicket = async () => {
        const token: any = await getAccessToken()
        axios.get(`${process.env.REACT_APP_API_BASE_URL}complete-ticket/${isModalOpen.ticketId}`, {
            headers: {
                'content-type': 'application/json',
                'accessToken': token
            }
        })
            .then(async (res) => {
                if (res?.data) {
                    showNotificationMessage(NOTIFICATION_TYPES.SUCCESS, TOASTER_MESSAGES.SUCCESS_CLOSED)
                        await form.resetFields()
                        setIsModalOpen({
                            isOpen: false,
                            ticketId: 0,
                            ticketTitle: '',
                            managerId: 0
                        })
                        await getTicketsData()
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

    return (
        <div className="tickets">
            <Row>
                <Col span={12}>
                    <h1>Tickets Listing</h1>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={tickets}
                loading={false}
                sortDirections={['ascend', 'descend', 'ascend']}
            />

            <Modal
                title={<h3>Assign <strong>{isModalOpen.ticketTitle}</strong> to Operation Manager</h3>}
                visible={userType === UserTypes.Admin && isModalOpen.isOpen}
                onCancel={handleModalClose}
                footer={null}
            >
                <Form layout="vertical" form={form} onFinish={submitHandler}>
                    <Form.Item
                        label="Operation Manager"
                        name="assignedTo"
                        rules={[{ required: true, message: 'Please select Operation Manager' }]}
                        validateTrigger={['onBlur', 'onChange']}
                    >
                        <Select placeholder="Select a Operation Manager"                        >
                            {
                                operationsManagerOptions.map((ele: SELECT_OPTIONS) =>
                                    <Option key={ele.id} value={ele.id}>{ele.name}</Option>
                                )
                            }
                        </Select>
                    </Form.Item>

                    <Button type="primary" block htmlType="submit">
                        Assign
                    </Button>
                </Form>
            </Modal>

            <Modal visible={userType === UserTypes.Operation_Manager && isModalOpen.isOpen} onOk={handleCloseTicket} onCancel={handleModalClose}>
                <p>
                    Do you want to close this ticket <strong>{isModalOpen.ticketTitle}?</strong>
                </p>
            </Modal>
        </div>
    )
}

export default TicketsList