import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import {useRouter} from "next/router";
import { fetch } from '../../stores/pots/potsSlice'
import dataFormatter from '../../helpers/dataFormatter';
import LayoutAuthenticated from "../../layouts/Authenticated";
import {getPageTitle} from "../../config";
import SectionTitleLineWithButton from "../../components/SectionTitleLineWithButton";
import SectionMain from "../../components/SectionMain";
import CardBox from "../../components/CardBox";
import BaseButton from "../../components/BaseButton";
import BaseDivider from "../../components/BaseDivider";
import {mdiChartTimelineVariant} from "@mdi/js";
import {SwitchField} from "../../components/SwitchField";
import FormField from "../../components/FormField";

const PotsView = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { pots } = useAppSelector((state) => state.pots)

    const { id } = router.query;

    function removeLastCharacter(str) {
      console.log(str,`str`)
      return str.slice(0, -1);
    }

    useEffect(() => {
        dispatch(fetch({ id }));
    }, [dispatch, id]);

    return (
      <>
          <Head>
              <title>{getPageTitle('View pots')}</title>
          </Head>
          <SectionMain>
            <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={removeLastCharacter('View pots')} main>
                <BaseButton
                  color='info'
                  label='Edit'
                  href={`/pots/pots-edit/?id=${id}`}
                />
            </SectionTitleLineWithButton>
            <CardBox>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Name</p>
                    <p>{pots?.name}</p>
                </div>

                <>
                    <p className={'block font-bold mb-2'}>Users Pots</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>First Name</th>

                                <th>Last Name</th>

                                <th>Phone Number</th>

                                <th>E-Mail</th>

                                <th>Disabled</th>

                            </tr>
                            </thead>
                            <tbody>
                            {pots.users_pots && Array.isArray(pots.users_pots) &&
                              pots.users_pots.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/users/users-view/?id=${item.id}`)}>

                                    <td data-label="firstName">
                                        { item.firstName }
                                    </td>

                                    <td data-label="lastName">
                                        { item.lastName }
                                    </td>

                                    <td data-label="phoneNumber">
                                        { item.phoneNumber }
                                    </td>

                                    <td data-label="email">
                                        { item.email }
                                    </td>

                                    <td data-label="disabled">
                                        { dataFormatter.booleanFormatter(item.disabled) }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!pots?.users_pots?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <>
                    <p className={'block font-bold mb-2'}>Alerts pots</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>Message</th>

                                <th>TriggeredAt</th>

                            </tr>
                            </thead>
                            <tbody>
                            {pots.alerts_pots && Array.isArray(pots.alerts_pots) &&
                              pots.alerts_pots.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/alerts/alerts-view/?id=${item.id}`)}>

                                    <td data-label="message">
                                        { item.message }
                                    </td>

                                    <td data-label="triggered_at">
                                        { dataFormatter.dateTimeFormatter(item.triggered_at) }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!pots?.alerts_pots?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <>
                    <p className={'block font-bold mb-2'}>Anomalies pots</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>Description</th>

                                <th>DetectedAt</th>

                            </tr>
                            </thead>
                            <tbody>
                            {pots.anomalies_pots && Array.isArray(pots.anomalies_pots) &&
                              pots.anomalies_pots.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/anomalies/anomalies-view/?id=${item.id}`)}>

                                    <td data-label="description">
                                        { item.description }
                                    </td>

                                    <td data-label="detected_at">
                                        { dataFormatter.dateTimeFormatter(item.detected_at) }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!pots?.anomalies_pots?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <>
                    <p className={'block font-bold mb-2'}>Data_sources Pot</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>URL</th>

                                <th>Description</th>

                            </tr>
                            </thead>
                            <tbody>
                            {pots.data_sources_pot && Array.isArray(pots.data_sources_pot) &&
                              pots.data_sources_pot.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/data_sources/data_sources-view/?id=${item.id}`)}>

                                    <td data-label="url">
                                        { item.url }
                                    </td>

                                    <td data-label="description">
                                        { item.description }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!pots?.data_sources_pot?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <>
                    <p className={'block font-bold mb-2'}>Data_sources pots</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>URL</th>

                                <th>Description</th>

                            </tr>
                            </thead>
                            <tbody>
                            {pots.data_sources_pots && Array.isArray(pots.data_sources_pots) &&
                              pots.data_sources_pots.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/data_sources/data_sources-view/?id=${item.id}`)}>

                                    <td data-label="url">
                                        { item.url }
                                    </td>

                                    <td data-label="description">
                                        { item.description }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!pots?.data_sources_pots?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <>
                    <p className={'block font-bold mb-2'}>Scraping_tasks pots</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>ScheduledTime</th>

                                <th>Status</th>

                            </tr>
                            </thead>
                            <tbody>
                            {pots.scraping_tasks_pots && Array.isArray(pots.scraping_tasks_pots) &&
                              pots.scraping_tasks_pots.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/scraping_tasks/scraping_tasks-view/?id=${item.id}`)}>

                                    <td data-label="scheduled_time">
                                        { dataFormatter.dateTimeFormatter(item.scheduled_time) }
                                    </td>

                                    <td data-label="status">
                                        { item.status }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!pots?.scraping_tasks_pots?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <BaseDivider />

                <BaseButton
                    color='info'
                    label='Back'
                    onClick={() => router.push('/pots/pots-list')}
                />
              </CardBox>
          </SectionMain>
      </>
    );
};

PotsView.getLayout = function getLayout(page: ReactElement) {
    return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
    )
}

export default PotsView;
