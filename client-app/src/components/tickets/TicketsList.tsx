import { Button, Col, Form, Input, Modal, Row, Table } from "antd"
import TextArea from "antd/lib/input/TextArea"
import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import moment from 'moment'

import { NOTIFICATION_TYPES, STATUS_CODES } from "../../constants/common"
import { TICKETS_LIST, TICKET_MESSAGES } from "../../constants/tickets"
import { getAccessToken, removeAccessToken, showNotificationMessage } from "../../helpers"
import * as routes from '../../constants/routes';

const TicketsList = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm()
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [tickets, setTickets] = useState<TICKETS_LIST[]>([])

    useEffect(() => {
        getTicketsData()
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

    const columns = [
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
            key: 'createdAt',
            dataIndex: 'createdAt',
            title: 'Created At',
            render: (createdAt: string) => (
                <div>{moment(createdAt).format("MMMM Do YYYY, h:mm a")}</div>
            )
        },
        {
            key: 'operationsManager',
            dataIndex: 'operationsManager',
            title: 'Assigned To',
            render: (operationsManager: any) => <div>{operationsManager && operationsManager.name}</div>
        },
        {
            key: 'status',
            dataIndex: 'status',
            title: 'Status',
        }
    ]

    const handleModalClose = async () => {
        await form.resetFields()
        setIsModalOpen(false)
    }

    const submitHandler = async () => {
        try {
            const values = await form.validateFields()
            const token: any = await getAccessToken()
            axios.post(`${process.env.REACT_APP_API_BASE_URL}create-ticket`, { title: values.title, description: values.description }, {
                headers: {
                    'content-type': 'application/json',
                    'accessToken': token
                }
            })
                .then(async (res) => {
                    if (res?.data) {
                        showNotificationMessage(NOTIFICATION_TYPES.SUCCESS, TICKET_MESSAGES.SUCCESS_TICKET)
                        await form.resetFields()
                        setIsModalOpen(false)
                        getTicketsData()
                    }
                })
                .catch((err) => {
                    showNotificationMessage(NOTIFICATION_TYPES.ERROR, err?.response?.data?.message)
                });
        } catch (error) {
            return error
        }
    }

    return (
        <div className="tickets">
            <Row>
                <Col span={12}>
                    <h1>Tickets Listing</h1>
                </Col>
                <Col span={12}>
                    <Button
                        type="primary"
                        className="create-ticket"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Create new ticket
                    </Button>
                </Col>
            </Row>
            <Table
                columns={columns}
                dataSource={tickets}
                loading={false}
                sortDirections={['ascend', 'descend', 'ascend']}
            />

            <Modal
                title={<h3>Create New Ticket</h3>}
                visible={isModalOpen}
                onCancel={handleModalClose}
                footer={null}
            >
                <Form layout="vertical" form={form} onFinish={submitHandler}>
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{ required: true, whitespace: true, message: 'Title is required' }]}
                        validateTrigger={['onBlur', 'onChange']}
                    >
                        <Input size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, whitespace: true, message: 'Description is required' }]}
                        validateTrigger={['onBlur', 'onChange']}
                    >
                        <TextArea rows={5} />
                    </Form.Item>

                    <Button type="primary" block htmlType="submit">
                        Create
                    </Button>
                </Form>
            </Modal>
        </div>
    )
}

export default TicketsList