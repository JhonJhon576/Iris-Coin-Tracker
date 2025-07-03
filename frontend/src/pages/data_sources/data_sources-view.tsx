import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import {useRouter} from "next/router";
import { fetch } from '../../stores/data_sources/data_sourcesSlice'
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

const Data_sourcesView = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { data_sources } = useAppSelector((state) => state.data_sources)

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
              <title>{getPageTitle('View data_sources')}</title>
          </Head>
          <SectionMain>
            <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={removeLastCharacter('View data_sources')} main>
                <BaseButton
                  color='info'
                  label='Edit'
                  href={`/data_sources/data_sources-edit/?id=${id}`}
                />
            </SectionTitleLineWithButton>
            <CardBox>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>URL</p>
                    <p>{data_sources?.url}</p>
                </div>

                <FormField label='Multi Text' hasTextareaHeight>
                  <textarea className={'w-full'} disabled value={data_sources?.description} />
                </FormField>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Pot</p>

                        <p>{data_sources?.pot?.name ?? 'No data'}</p>

                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>pots</p>

                        <p>{data_sources?.pots?.name ?? 'No data'}</p>

                </div>

                <>
                    <p className={'block font-bold mb-2'}>Anomalies DataSource</p>
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
                            {data_sources.anomalies_data_source && Array.isArray(data_sources.anomalies_data_source) &&
                              data_sources.anomalies_data_source.map((item: any) => (
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
                        {!data_sources?.anomalies_data_source?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <>
                    <p className={'block font-bold mb-2'}>Scraping_tasks DataSource</p>
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
                            {data_sources.scraping_tasks_data_source && Array.isArray(data_sources.scraping_tasks_data_source) &&
                              data_sources.scraping_tasks_data_source.map((item: any) => (
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
                        {!data_sources?.scraping_tasks_data_source?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <BaseDivider />

                <BaseButton
                    color='info'
                    label='Back'
                    onClick={() => router.push('/data_sources/data_sources-list')}
                />
              </CardBox>
          </SectionMain>
      </>
    );
};

Data_sourcesView.getLayout = function getLayout(page: ReactElement) {
    return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
    )
}

export default Data_sourcesView;
