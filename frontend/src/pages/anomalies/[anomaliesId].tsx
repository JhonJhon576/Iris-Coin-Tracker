import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement, useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'

import { Field, Form, Formik } from 'formik'
import FormField from '../../components/FormField'
import BaseDivider from '../../components/BaseDivider'
import BaseButtons from '../../components/BaseButtons'
import BaseButton from '../../components/BaseButton'
import FormCheckRadio from '../../components/FormCheckRadio'
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup'
import { SelectField } from "../../components/SelectField";
import { SelectFieldMany } from "../../components/SelectFieldMany";
import { SwitchField } from '../../components/SwitchField'
import {RichTextField} from "../../components/RichTextField";

import { update, fetch } from '../../stores/anomalies/anomaliesSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'

const EditAnomalies = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    description: '',

    detected_at: new Date(),

    data_source: null,

    pots: null,

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { anomalies } = useAppSelector((state) => state.anomalies)

  const { anomaliesId } = router.query

  useEffect(() => {
    dispatch(fetch({ id: anomaliesId }))
  }, [anomaliesId])

  useEffect(() => {
    if (typeof anomalies === 'object') {
      setInitialValues(anomalies)
    }
  }, [anomalies])

  useEffect(() => {
      if (typeof anomalies === 'object') {

          const newInitialVal = {...initVals};

          Object.keys(initVals).forEach(el => newInitialVal[el] = (anomalies)[el])

          setInitialValues(newInitialVal);
      }
  }, [anomalies])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: anomaliesId, data }))
    await router.push('/anomalies/anomalies-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit anomalies')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit anomalies'} main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>

    <FormField label="Description" hasTextareaHeight>
        <Field name="description" as="textarea" placeholder="Description" />
    </FormField>

      <FormField
          label="DetectedAt"
      >
          <DatePicker
              dateFormat="yyyy-MM-dd hh:mm"
              showTimeSelect
              selected={initialValues.detected_at ?
                  new Date(
                      dayjs(initialValues.detected_at).format('YYYY-MM-DD hh:mm'),
                  ) : null
              }
              onChange={(date) => setInitialValues({...initialValues, 'detected_at': date})}
          />
      </FormField>

    <FormField label='DataSource' labelFor='data_source'>
        <Field
            name='data_source'
            id='data_source'
            component={SelectField}
            options={initialValues.data_source}
            itemRef={'data_sources'}

            showField={'url'}

        ></Field>
    </FormField>

    <FormField label='pots' labelFor='pots'>
        <Field
            name='pots'
            id='pots'
            component={SelectField}
            options={initialValues.pots}
            itemRef={'pots'}

            showField={'name'}

        ></Field>
    </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/anomalies/anomalies-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditAnomalies.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditAnomalies
