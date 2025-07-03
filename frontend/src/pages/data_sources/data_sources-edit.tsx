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

import { update, fetch } from '../../stores/data_sources/data_sourcesSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'
import dataFormatter from '../../helpers/dataFormatter';

const EditData_sourcesPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    'url': '',

    description: '',

    pot: null,

    pots: null,

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { data_sources } = useAppSelector((state) => state.data_sources)

  const { id } = router.query

  useEffect(() => {
    dispatch(fetch({ id: id }))
  }, [id])

  useEffect(() => {
    if (typeof data_sources === 'object') {
      setInitialValues(data_sources)
    }
  }, [data_sources])

  useEffect(() => {
      if (typeof data_sources === 'object') {
          const newInitialVal = {...initVals};
          Object.keys(initVals).forEach(el => newInitialVal[el] = (data_sources)[el])
          setInitialValues(newInitialVal);
      }
  }, [data_sources])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: id, data }))
    await router.push('/data_sources/data_sources-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit data_sources')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit data_sources'} main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>

    <FormField
        label="URL"
    >
        <Field
            name="url"
            placeholder="URL"
        />
    </FormField>

    <FormField label="Description" hasTextareaHeight>
        <Field name="description" as="textarea" placeholder="Description" />
    </FormField>

  <FormField label='Pot' labelFor='pot'>
        <Field
            name='pot'
            id='pot'
            component={SelectField}
            options={initialValues.pot}
            itemRef={'pots'}

            showField={'name'}

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
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/data_sources/data_sources-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditData_sourcesPage.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditData_sourcesPage
