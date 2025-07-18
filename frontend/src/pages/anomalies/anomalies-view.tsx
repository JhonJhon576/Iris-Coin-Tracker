import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import {useRouter} from "next/router";
import { fetch } from '../../stores/anomalies/anomaliesSlice'
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

const AnomaliesView = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { anomalies } = useAppSelector((state) => state.anomalies)

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
              <title>{getPageTitle('View anomalies')}</title>
          </Head>
          <SectionMain>
            <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={removeLastCharacter('View anomalies')} main>
                <BaseButton
                  color='info'
                  label='Edit'
                  href={`/anomalies/anomalies-edit/?id=${id}`}
                />
            </SectionTitleLineWithButton>
            <CardBox>

                <FormField label='Multi Text' hasTextareaHeight>
                  <textarea className={'w-full'} disabled value={anomalies?.description} />
                </FormField>

                <FormField label='DetectedAt'>
                    {anomalies.detected_at ? <DatePicker
                      dateFormat="yyyy-MM-dd hh:mm"
                      showTimeSelect
                      selected={anomalies.detected_at ?
                        new Date(
                          dayjs(anomalies.detected_at).format('YYYY-MM-DD hh:mm'),
                        ) : null
                      }
                      disabled
                    /> : <p>No DetectedAt</p>}
                </FormField>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>DataSource</p>

                        <p>{anomalies?.data_source?.url ?? 'No data'}</p>

                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>pots</p>

                        <p>{anomalies?.pots?.name ?? 'No data'}</p>

                </div>

                <BaseDivider />

                <BaseButton
                    color='info'
                    label='Back'
                    onClick={() => router.push('/anomalies/anomalies-list')}
                />
              </CardBox>
          </SectionMain>
      </>
    );
};

AnomaliesView.getLayout = function getLayout(page: ReactElement) {
    return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
    )
}

export default AnomaliesView;
