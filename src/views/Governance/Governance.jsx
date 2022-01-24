import React, { useState } from 'react';
import { Col, Row, Tab, Table, Tabs, Button } from 'react-bootstrap';

import './governance.scss'

const Governance = () => {

    const [btnActive, setBtnActive] = useState(1);
    const [isActive, setIsActive] = useState(2)

    return (
        <>
            <div className="governance">
                <div className="tabs-con pb-4">
                    <Tabs defaultActiveKey="overview" id="uncontrolled-tab-example">
                        <Tab eventKey="overview" title="Overview" >
                            <div className="overview-sub">
                                <Row>
                                    <Col lg={6} md={12} className="mt-3" >
                                        <div className="overviw-btn">
                                            <span>CHEEZ STAKED</span>
                                            <h2 className="mb-0">116,942,097.5766</h2>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={12} className="mt-3">
                                        <div className="overviw-btn">
                                            <span>veCHEEZ</span>
                                            <h2 className="mb-0">118,332,558.0462</h2>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={6} md={12} className="mt-3" >
                                        <div className="overviw-btn">
                                            <span>AVG. LOCK TIME</span>
                                            <h2 className="mb-0">2mo 17d 21h 27m 39s</h2>
                                            <p>average time</p>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={12} className="mt-3">
                                        <div className="overviw-btn">
                                            <span>CHEEZ REWARDS</span>
                                            <h2 className="mb-0">31,203,611.9444</h2>
                                            <p>out of 50,000,000</p>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={6} md={12} className="mt-3" >
                                        <div className="overviw-btn">
                                            <span>DELEGATED</span>
                                            <h2 className="mb-0">248,714.5259</h2>
                                            <p>out of 1,000,000,000</p>
                                        </div>
                                    </Col>
                                    <Col lg={6} md={12} className="mt-3">
                                        <div className="overviw-btn">
                                            <span>ADDRESSES</span>
                                            <h2 className="mb-0">1768 holders</h2>
                                            <p>894 stakers & 76 voters</p>
                                        </div>
                                    </Col>
                                </Row>

                                <div className="overview-table mt-4">
                                    <h2>Voter weights</h2>
                                    <div className="overview-list">
                                        <Table responsive>
                                            <thead>
                                                <tr>
                                                    <th><span className="my-3 d-block">Address</span></th>
                                                    <th>Staked Balance</th>
                                                    <th>Voting Power</th>
                                                    <th>Votes</th>
                                                    <th>Proposals</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><span className="my-3 d-block">0x8a90cab2b38dba80c64b7734e58ee1db38b8992e</span></td>
                                                    <td>15,380,788.30</td>
                                                    <td>15,380,788.30</td>
                                                    <td>3</td>
                                                    <td>0</td>
                                                </tr>
                                                <tr>
                                                    <td><span className="my-3 d-block">0x8a90cab2b38dba80c64b7734e58ee1db38b8992e</span></td>
                                                    <td>15,380,788.30</td>
                                                    <td>15,380,788.30</td>
                                                    <td>3</td>
                                                    <td>0</td>
                                                </tr>
                                                <tr>
                                                    <td><span className="my-3 d-block">0x8a90cab2b38dba80c64b7734e58ee1db38b8992e</span></td>
                                                    <td>15,380,788.30</td>
                                                    <td>15,380,788.30</td>
                                                    <td>3</td>
                                                    <td>0</td>
                                                </tr>
                                                <tr>
                                                    <td><span className="my-3 d-block">0x8a90cab2b38dba80c64b7734e58ee1db38b8992e</span></td>
                                                    <td>15,380,788.30</td>
                                                    <td>15,380,788.30</td>
                                                    <td>3</td>
                                                    <td>0</td>
                                                </tr>
                                                <tr>
                                                    <td><span className="my-3 d-block">0x8a90cab2b38dba80c64b7734e58ee1db38b8992e</span></td>
                                                    <td>15,380,788.30</td>
                                                    <td>15,380,788.30</td>
                                                    <td>3</td>
                                                    <td>0</td>
                                                </tr>
                                                <tr>
                                                    <td><span className="my-3 d-block">0x8a90cab2b38dba80c64b7734e58ee1db38b8992e</span></td>
                                                    <td>15,380,788.30</td>
                                                    <td>15,380,788.30</td>
                                                    <td>3</td>
                                                    <td>0</td>
                                                </tr>
                                                <tr>
                                                    <td><span className="my-3 d-block">0x8a90cab2b38dba80c64b7734e58ee1db38b8992e</span></td>
                                                    <td>15,380,788.30</td>
                                                    <td>15,380,788.30</td>
                                                    <td>3</td>
                                                    <td>0</td>
                                                </tr>
                                                <tr>
                                                    <td><span className="my-3 d-block">0x8a90cab2b38dba80c64b7734e58ee1db38b8992e</span></td>
                                                    <td>15,380,788.30</td>
                                                    <td>15,380,788.30</td>
                                                    <td>3</td>
                                                    <td>0</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                        <div className='pagination  b-0 px-2'>
                                            <span>Showing 1 to 10 out of 894 stakers</span>
                                            <div className="pagination-btns ms-auto d-flex align-items-center">
                                                <Button><img src={require('./left-arrow.png').default} alt="" /></Button>
                                                <Button className="pages active">1</Button>
                                                <Button className="pages">2</Button>
                                                <Button className="pages">3</Button>
                                                <Button>...</Button>
                                                <Button className="pages">5</Button>
                                                <Button><img src={require('./right-arrow.png').default} alt="" /></Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </Tab>
                        <Tab eventKey="wallet" title="Wallet">
                            <div className="wallet-con">
                                <Tabs defaultActiveKey="deposit" id="uncontrolled-tab-example" className="mb-3">
                                    <Tab eventKey="deposit" title="Deposit">
                                        <div className='lock-list'>
                                            <Table responsive className='mb-0'>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <div className='d-flex align-items-center'>
                                                                <img src={require('./chees.png').default} alt="" />
                                                                <span className='ms-2'>CHEEZ</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className='text-left'>
                                                                <p className='mb-0'>Staked Balance</p>
                                                                <h4 className='mb-0'>0</h4>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className='text-left'>
                                                                <p className='mb-0'>Staked Balance</p>
                                                                <h4 className='mb-0'>0</h4>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className='text-left'>
                                                                <p className='mb-0'>Staked Balance</p>
                                                                <h4 className='mb-0'>0</h4>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <img src={require('./toggle.png').default} alt="" />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </div>
                                    </Tab>
                                    <Tab eventKey="lock" title="Lock">
                                        <div className='deposit-sub'>
                                            <div className='lock-list'>
                                                <div className='halp-w'>
                                                    <Table responsive className='mb-0'>
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <div className='d-flex align-items-center'>
                                                                        <img src={require('./chees.png').default} alt="" />
                                                                        <span className='ms-2'>CHEEZ</span>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className='text-left'>
                                                                        <p className='mb-0'>Staked Balance</p>
                                                                        <h4 className='mb-0'>0</h4>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className='text-left'>
                                                                        <p className='mb-0'>Staked Balance</p>
                                                                        <h4 className='mb-0'>0</h4>
                                                                    </div>
                                                                </td>
                                                                <td>

                                                                </td>
                                                                <td>

                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </div>
                                            <Row className='mt-4'>
                                                <Col lg={6} md={12}>
                                                    <div className='lock-left'>
                                                        <div className='duration-main'>
                                                            <h5>Add lock duration</h5>
                                                            <div className='wrap d-flex align-items-center gap'>
                                                                <div className='duration-box mt-2'>
                                                                    <span>1w</span>
                                                                </div>
                                                                <div className='duration-box mt-2'>
                                                                    <span>1mo</span>
                                                                </div>
                                                                <div className='duration-box mt-2'>
                                                                    <span>3mo</span>
                                                                </div>
                                                                <div className='duration-box mt-2'>
                                                                    <span>6mo</span>
                                                                </div>
                                                                <div className='duration-box mt-2'>
                                                                    <span>1y</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p>or</p>
                                                        <div className='data-input'>
                                                            <h5 className='mb-0'>Manual choose your lock end date</h5>
                                                            <input type="text" />
                                                        </div>
                                                        <div className='def-yellow mt-4 d-flex align-items-center gap'>
                                                            <img src={require('./warning.svg').default} alt="" />
                                                            <p>Your locked balances will be unavailable for withdrawal until the lock timer ends. Any future deposits will be locked for the same time.</p>
                                                        </div>
                                                        <Button className="lock mt-4">Lock</Button>
                                                    </div>
                                                </Col>
                                                <Col lg={6} md={12}>
                                                    <div className='lock-right'>
                                                        <h5>Gas Fee (Gwei)</h5>
                                                        <Row>
                                                            <Col lg={6} md={6} sm={12} className='mt-3'>
                                                                <div className='gwei-box active d-flex align-items-center justify-content-between'>
                                                                    <div>
                                                                        <span>Very fast</span>
                                                                        <h4 className='mb-0 mt-2'>80 Gwei</h4>
                                                                    </div>
                                                                    <input type="radio" name='gwei' className='checkbox' />
                                                                </div>
                                                            </Col>
                                                            <Col lg={6} md={6} sm={12} className='mt-3'>
                                                                <div className='gwei-box d-flex align-items-center justify-content-between'>
                                                                    <div>
                                                                        <span>fast</span>
                                                                        <h4 className='mb-0 mt-2'>79 Gwei</h4>
                                                                    </div>
                                                                    <input type="radio" name='gwei' className='checkbox' />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col lg={6} md={6} sm={12} className='mt-3'>
                                                                <div className='gwei-box d-flex align-items-center justify-content-between'>
                                                                    <div>
                                                                        <span>Standard</span>
                                                                        <h4 className='mb-0 mt-2'>79 Gwei</h4>
                                                                    </div>
                                                                    <input type="radio" name='gwei' className='checkbox' />
                                                                </div>
                                                            </Col>
                                                            <Col lg={6} md={6} sm={12} className='mt-3'>
                                                                <div className='gwei-box d-flex align-items-center justify-content-between'>
                                                                    <div>
                                                                        <span>Slow</span>
                                                                        <h4 className='mb-0 mt-2'>79 Gwei</h4>
                                                                    </div>
                                                                    <input type="radio" name='gwei' className='checkbox' />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Tab>
                                    <Tab eventKey="delegate" title="Delegate">
                                        <div className='deposit-sub'>
                                            <div className='lock-list'>
                                                <div className='halp-w'>
                                                    <Table responsive className='mb-0'>
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <div className='d-flex align-items-center'>
                                                                        <img src={require('./chees.png').default} alt="" />
                                                                        <span className='ms-2'>CHEEZ</span>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className='text-left'>
                                                                        <p className='mb-0'>Staked Balance</p>
                                                                        <h4 className='mb-0'>0</h4>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className='text-left'>
                                                                        <p className='mb-0'>Staked Balance</p>
                                                                        <h4 className='mb-0'>0</h4>
                                                                    </div>
                                                                </td>
                                                                <td>

                                                                </td>
                                                                <td>

                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </div>
                                            <Row className='mt-4'>
                                                <Col lg={6} md={12}>
                                                    <div className='lock-left'>
                                                        <div className='data-input'>
                                                            <h5 className='mb-0'>Delegate address</h5>
                                                            <input type="text" />
                                                        </div>
                                                        <div className='def-yellow mt-4 d-flex align-items-center gap'>
                                                            <img src={require('./warning.svg').default} alt="" />
                                                            <p>Delegating your voting power to this address means that they will be able to vote in your place. You can’t delegate the voting bonus, only the staked balance.</p>
                                                        </div>
                                                        <Button className="lock mt-4">Lock</Button>
                                                    </div>
                                                </Col>
                                                <Col lg={6} md={12}>
                                                    <div className='lock-right'>
                                                        <h5>Gas Fee (Gwei)</h5>
                                                        <Row>
                                                            <Col lg={6} md={6} sm={12} className='mt-3'>
                                                                <div className='gwei-box active d-flex align-items-center justify-content-between'>
                                                                    <div>
                                                                        <span>Very fast</span>
                                                                        <h4 className='mb-0 mt-2'>80 Gwei</h4>
                                                                    </div>
                                                                    <input type="radio" name='gwei' className='checkbox' />
                                                                </div>
                                                            </Col>
                                                            <Col lg={6} md={6} sm={12} className='mt-3'>
                                                                <div className='gwei-box d-flex align-items-center justify-content-between'>
                                                                    <div>
                                                                        <span>fast</span>
                                                                        <h4 className='mb-0 mt-2'>79 Gwei</h4>
                                                                    </div>
                                                                    <input type="radio" name='gwei' className='checkbox' />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col lg={6} md={6} sm={12} className='mt-3'>
                                                                <div className='gwei-box d-flex align-items-center justify-content-between'>
                                                                    <div>
                                                                        <span>Standard</span>
                                                                        <h4 className='mb-0 mt-2'>79 Gwei</h4>
                                                                    </div>
                                                                    <input type="radio" name='gwei' className='checkbox' />
                                                                </div>
                                                            </Col>
                                                            <Col lg={6} md={6} sm={12} className='mt-3'>
                                                                <div className='gwei-box d-flex align-items-center justify-content-between'>
                                                                    <div>
                                                                        <span>Slow</span>
                                                                        <h4 className='mb-0 mt-2'>79 Gwei</h4>
                                                                    </div>
                                                                    <input type="radio" name='gwei' className='checkbox' />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Tab>
                                    <Tab eventKey="withdraw" title="Withdraw">
                                        <div className='deposit-sub'>
                                            <div className='lock-list'>
                                                <div className='halp-w'>
                                                    <Table responsive className='mb-0'>
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <div className='d-flex align-items-center'>
                                                                        <img src={require('./chees.png').default} alt="" />
                                                                        <span className='ms-2'>CHEEZ</span>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className='text-left'>
                                                                        <p className='mb-0'>Staked Balance</p>
                                                                        <h4 className='mb-0'>0</h4>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <div className='text-left'>
                                                                        <p className='mb-0'>Staked Balance</p>
                                                                        <h4 className='mb-0'>0</h4>
                                                                    </div>
                                                                </td>
                                                                <td>

                                                                </td>
                                                                <td>

                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            </div>
                                            <Row className='mt-4'>
                                                <Col lg={6} md={12}>
                                                    <div className='lock-left'>
                                                        <div className='data-input'>
                                                            <h5 className='mb-0'>Delegate address</h5>
                                                            <input type="text" />
                                                        </div>
                                                        <div className='def-yellow mt-4 d-flex align-items-center gap'>
                                                            <img src={require('./warning.svg').default} alt="" />
                                                            <p>Delegating your voting power to this address means that they will be able to vote in your place. You can’t delegate the voting bonus, only the staked balance.</p>
                                                        </div>
                                                        <Button className="lock mt-4">Lock</Button>
                                                    </div>
                                                </Col>
                                                <Col lg={6} md={12}>
                                                    <div className='lock-right'>
                                                        <h5>Gas Fee (Gwei)</h5>
                                                        <Row>
                                                            <Col lg={6} md={6} sm={12} className='mt-3'>
                                                                <div className='gwei-box active d-flex align-items-center justify-content-between'>
                                                                    <div>
                                                                        <span>Very fast</span>
                                                                        <h4 className='mb-0 mt-2'>80 Gwei</h4>
                                                                    </div>
                                                                    <input type="radio" name='gwei' className='checkbox' />
                                                                </div>
                                                            </Col>
                                                            <Col lg={6} md={6} sm={12} className='mt-3'>
                                                                <div className='gwei-box d-flex align-items-center justify-content-between'>
                                                                    <div>
                                                                        <span>fast</span>
                                                                        <h4 className='mb-0 mt-2'>79 Gwei</h4>
                                                                    </div>
                                                                    <input type="radio" name='gwei' className='checkbox' />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col lg={6} md={6} sm={12} className='mt-3'>
                                                                <div className='gwei-box d-flex align-items-center justify-content-between'>
                                                                    <div>
                                                                        <span>Standard</span>
                                                                        <h4 className='mb-0 mt-2'>79 Gwei</h4>
                                                                    </div>
                                                                    <input type="radio" name='gwei' className='checkbox' />
                                                                </div>
                                                            </Col>
                                                            <Col lg={6} md={6} sm={12} className='mt-3'>
                                                                <div className='gwei-box d-flex align-items-center justify-content-between'>
                                                                    <div>
                                                                        <span>Slow</span>
                                                                        <h4 className='mb-0 mt-2'>79 Gwei</h4>
                                                                    </div>
                                                                    <input type="radio" name='gwei' className='checkbox' />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Tab>
                                </Tabs>
                            </div>
                        </Tab>
                        <Tab eventKey="proposals" title="Proposals">
                            <div className="proposals-sub mt-3">
                                <div className="proposal-header">
                                    <div className="pro-btns">
                                        <Button className={`${btnActive === 1 ? "active" : ""}`} onClick={() => setBtnActive(1)}>All proposals</Button>
                                        <Button className={`${btnActive === 2 ? "active" : ""}`} onClick={() => setBtnActive(2)}>Active</Button>
                                        <Button className={`${btnActive === 3 ? "active" : ""}`} onClick={() => setBtnActive(3)}>Executed</Button>
                                        <Button className={`${btnActive === 4 ? "active" : ""}`} onClick={() => setBtnActive(4)}>Failed</Button>
                                    </div>
                                    <div className="searchbar">
                                        <input type="text" placeholder="Search" />
                                    </div>
                                </div>
                                <div className="overview-list">
                                    <Table responsive>
                                        <thead>
                                            <tr>
                                                <th><span className="my-3 d-block">Proposals</span></th>
                                                <th><span className="title-span">Votes</span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div className="my-2">
                                                        <span className="mb-2 d-block">PID-3: NFT.NYC Event Sponsorship Funding</span>
                                                        <span className="token">EXECUTED</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center gap justify-content-center">
                                                        <div>
                                                            <img src={require('./green-line.png').default} alt="" />
                                                            <span className='ms-3'>100%</span>
                                                        </div>
                                                        <div>
                                                            <img src={require('./pink-line.png').default} alt="" />
                                                            <span className='ms-3'>100%</span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="my-2">
                                                        <span className="mb-2 d-block">PID-3: NFT.NYC Event Sponsorship Funding</span>
                                                        <span className="token">EXECUTED</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center gap justify-content-center">
                                                        <div>
                                                            <img src={require('./green-line.png').default} alt="" />
                                                            <span className='ms-3'>100%</span>
                                                        </div>
                                                        <div>
                                                            <img src={require('./pink-line.png').default} alt="" />
                                                            <span className='ms-3'>100%</span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="my-2">
                                                        <span className="mb-2 d-block">PID-3: NFT.NYC Event Sponsorship Funding</span>
                                                        <span className="token">EXECUTED</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center gap justify-content-center">
                                                        <div>
                                                            <img src={require('./green-line.png').default} alt="" />
                                                            <span className='ms-3'>100%</span>
                                                        </div>
                                                        <div>
                                                            <img src={require('./pink-line.png').default} alt="" />
                                                            <span className='ms-3'>100%</span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    <div className='pagination  b-0 px-2'>
                                        <span>Showing 1 to 3 out of 3 proposals</span>
                                        <div className="pagination-btns ms-auto d-flex align-items-center">
                                            <Button><img src={require('./left-arrow.png').default} alt="" /></Button>
                                            <Button className="pages active">1</Button>
                                            <Button><img src={require('./right-arrow.png').default} alt="" /></Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="treasury" title="Treasury">
                            <div className='trasury-sub'>
                                <div className="trasury-header mt-3">
                                    <span>Total holdings balance</span>
                                    <h2>$7,570,580.88</h2>
                                </div>
                                <Row>
                                    <Col lg={4} md={6} sm={12} className="mt-3">
                                        <div className={`${isActive === 1 ? "active" : ""} trasury-box`} onClick={() => setIsActive(1)} >
                                            <div className="d-flex align-items-center ">
                                                <img src={require('./eth.png').default} alt="" />
                                                <span>ETH</span>
                                            </div>
                                            <h2 className='mb-0'>741.48</h2>
                                            <p className='mb-0'>$2,336,269.33</p>
                                        </div>
                                    </Col>
                                    <Col lg={4} md={6} sm={12} className="mt-3">
                                        <div className={`${isActive === 2 ? "active" : ""} trasury-box`} onClick={() => setIsActive(2)}>
                                            <div className="d-flex align-items-center ">
                                                <img src={require('./chees.png').default} alt="" />
                                                <span>CHEEZ</span>
                                            </div>
                                            <h2 className='mb-0'>71,190,000</h2>
                                            <p className='mb-0'>$5,234,311.55</p>
                                        </div>
                                    </Col>
                                </Row>

                                <div className='trasury-list mt-5'>
                                    <div className='trasury-list-header p-2'>
                                        <h3>Transaction history</h3>
                                        <Button className='filter'>Filters</Button>
                                    </div>
                                    <div className="overview-list">
                                        <Table responsive>
                                            <thead>
                                                <tr>
                                                    <th><span className="my-3 d-block">Token Name</span></th>
                                                    <th>Transaction Hash</th>
                                                    <th>Date</th>
                                                    <th>Amount</th>
                                                    <th>From</th>
                                                    <th>To</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div className='d-flex align-items-center'>
                                                            <img src={require('./chees.png').default} alt="" />
                                                            <span className='ms-2'>CHEEZ</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className='text-b'>0x96e2...f8eb</span>
                                                    </td>
                                                    <td>
                                                        <div className='date'>
                                                            <h5 className='mb-0'>06.12.2021</h5>
                                                            <p className='mb-0'>07:24</p>
                                                        </div>
                                                    </td>
                                                    <td>+ 36,540,000</td>
                                                    <td>
                                                        <span className='text-b'>0xef14...92b9</span>
                                                    </td>
                                                    <td>
                                                        <span className='text-b'>Universe CHEEZ DAO & Treasury</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className='d-flex align-items-center'>
                                                            <img src={require('./chees.png').default} alt="" />
                                                            <span className='ms-2'>CHEEZ</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className='text-b'>0x96e2...f8eb</span>
                                                    </td>
                                                    <td>
                                                        <div className='date'>
                                                            <h5 className='mb-0'>06.12.2021</h5>
                                                            <p className='mb-0'>07:24</p>
                                                        </div>
                                                    </td>
                                                    <td>+ 36,540,000</td>
                                                    <td>
                                                        <span className='text-b'>0xef14...92b9</span>
                                                    </td>
                                                    <td>
                                                        <span className='text-b'>Universe CHEEZ DAO & Treasury</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className='d-flex align-items-center'>
                                                            <img src={require('./chees.png').default} alt="" />
                                                            <span className='ms-2'>CHEEZ</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className='text-b'>0x96e2...f8eb</span>
                                                    </td>
                                                    <td>
                                                        <div className='date'>
                                                            <h5 className='mb-0'>06.12.2021</h5>
                                                            <p className='mb-0'>07:24</p>
                                                        </div>
                                                    </td>
                                                    <td>+ 36,540,000</td>
                                                    <td>
                                                        <span className='text-b'>0xef14...92b9</span>
                                                    </td>
                                                    <td>
                                                        <span className='text-b'>Universe CHEEZ DAO & Treasury</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                        <div className='pagination  b-0 px-2'>
                                            <span>Showing 1 to 3 out of 3 proposals</span>
                                            <div className="pagination-btns ms-auto d-flex align-items-center">
                                                <Button><img src={require('./left-arrow.png').default} alt="" /></Button>
                                                <Button className="pages active">1</Button>
                                                <Button><img src={require('./right-arrow.png').default} alt="" /></Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </>
    )
};

export default Governance;
