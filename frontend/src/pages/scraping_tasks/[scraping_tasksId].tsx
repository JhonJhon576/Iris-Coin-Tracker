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

import { update, fetch } from '../../stores/scraping_tasks/scraping_tasksSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'

const EditScraping_tasks = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    data_source: null,

    scheduled_time: new Date(),

    status: '',

    pots: null,

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { scraping_tasks } = useAppSelector((state) => state.scraping_tasks)

  const { scraping_tasksId } = router.query

  useEffect(() => {
    dispatch(fetch({ id: scraping_tasksId }))
  }, [scraping_tasksId])

  useEffect(() => {
    if (typeof scraping_tasks === 'object') {
      setInitialValues(scraping_tasks)
    }
  }, [scraping_tasks])

  useEffect(() => {
      if (typeof scraping_tasks === 'object') {

          const newInitialVal = {...initVals};

          Object.keys(initVals).forEach(el => newInitialVal[el] = (scraping_tasks)[el])

          setInitialValues(newInitialVal);
      }
  }, [scraping_tasks])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: scraping_tasksId, data }))
    await router.push('/scraping_tasks/scraping_tasks-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit scraping_tasks')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit scraping_tasks'} main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>

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

      <FormField
          label="ScheduledTime"
      >
          <DatePicker
              dateFormat="yyyy-MM-dd hh:mm"
              showTimeSelect
              selected={initialValues.scheduled_time ?
                  new Date(
                      dayjs(initialValues.scheduled_time).format('YYYY-MM-DD hh:mm'),
                  ) : null
              }
              onChange={(date) => setInitialValues({...initialValues, 'scheduled_time': date})}
          />
      </FormField>

    <FormField label="Status" labelFor="status">
        <Field name="status" id="status" component="select">

            <option value="pending">pending</option>

            <option value="in_progress">in_progress</option>

            <option value="completed">completed</option>

            <option value="failed">failed</option>

        </Field>
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
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/scraping_tasks/scraping_tasks-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditScraping_tasks.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditScraping_tasks
