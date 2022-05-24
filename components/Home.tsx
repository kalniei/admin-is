import { Card, Grid, Typography, CircularProgress } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import { request } from '../helpers/restClient';
import { IWorkshopTableObject } from '../ts/interfaces';

ChartJS.register(ArcElement, Tooltip, Legend);

export const generalData = {
  labels: ['Poziom 0', 'Poziom 1', 'Poziom 2', 'Poziom 3', 'Poziom 4', 'Poziom nieznany'],
  datasets: [
    {
      label: 'Wszyscy użytkownicy',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderWidth: 1
    }
  ]
};

const Home = (): JSX.Element => {
  const [allUsersDataSet, setAllUsersDataSet] = useState<any>(null);
  const [wDrzwiSet, setWDrzwiSet] = useState<any>(null);
  const [wWipSet, setWWipSet] = useState<any>(null);
  const [wSejfSet, setWSejfSet] = useState<any>(null);
  const [wTwierdzaSet, setWTwierdzaSet] = useState<any>(null);
  const [wKrolestwoSet, setWKrolestwoSet] = useState<any>(null);

  const countAllLevel = (data: IWorkshopTableObject[]) => {
    const levelObject = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      n: 0
    };
    data.forEach((x) => {
      if (Number(x.level)) {
        levelObject[x.level] = levelObject[x.level] + 1;
      } else {
        levelObject['0'] = levelObject['0'] + 1;
      }
    });
    return Object.values(levelObject);
  };

  const countPaid = (data: IWorkshopTableObject[]) => {
    const paidObject = {
      paid: 0,
      notPaid: 0
    };
    data.forEach((x) => {
      console.log(x.paid);

      if (Number(x.paid) > 0) {
        paidObject['paid'] = paidObject['paid'] + 1;
      } else {
        paidObject['notPaid'] = paidObject['notPaid'] + 1;
      }
    });
    console.log(paidObject);

    return Object.values(paidObject);
  };

  const getAllUsers = async () => {
    try {
      const { data } = await request('post', '/getSingleTable', {
        table_name: 'ALL_Users_warsztaty'
      });
      setAllUsersDataSet({
        labels: ['Poziom 0', 'Poziom 1', 'Poziom 2', 'Poziom 3', 'Poziom 4'],
        datasets: [
          {
            label: 'Wszyscy użytkownicy',
            data: countAllLevel(data),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rrgb(7, 110, 29)',
              'rgb(233, 55, 23)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderWidth: 1
          }
        ]
      });
    } catch (error: any) {
      return;
    }
  };

  const getDrzwiUsers = async () => {
    try {
      const { data } = await request('post', '/getSingleTable', {
        table_name: '1_DDI_1_warsztaty'
      });
      setWDrzwiSet({
        labels: ['Zapłacony', 'Nie Zapłacony'],
        datasets: [
          {
            label: 'Wszyscy użytkownicy',
            data: countPaid(data),
            backgroundColor: ['rrgb(7, 110, 29)', 'rgb(233, 55, 23)'],
            borderWidth: 1
          }
        ]
      });
    } catch (error: any) {
      return;
    }
  };

  const getWIPUsers = async () => {
    try {
      const { data } = await request('post', '/getSingleTable', {
        table_name: '1_WIP_1_warsztaty'
      });
      setWWipSet({
        labels: ['Zapłacony', 'Nie Zapłacony'],
        datasets: [
          {
            label: 'Wszyscy użytkownicy',
            data: countPaid(data),
            backgroundColor: ['rgb(7, 110, 29)', 'rgb(233, 55, 23)'],
            borderWidth: 1
          }
        ]
      });
    } catch (error: any) {
      return;
    }
  };

  // const getSejfUsers = async () => {
  //   try {
  //     const { data } = await request('post', '/getSingleTable', {
  //       table_name: '2_SEJF_1_warsztaty'
  //     });
  //     setWSejfSet({
  //       labels: ['Zapłacony', 'Nie Zapłacony'],
  //       datasets: [
  //         {
  //           label: 'Wszyscy użytkownicy',
  //           data: countPaid(data),
  //           backgroundColor: ['rrgb(7, 110, 29)', 'rgb(233, 55, 23)'],
  //           borderWidth: 1
  //         }
  //       ]
  //     });
  //   } catch (error: any) {
  //     return;
  //   }
  // };

  // const getTwierdzaUsers = async () => {
  //   try {
  //     const { data } = await request('post', '/getSingleTable', {
  //       table_name: '3_TWIERDZA_1_warsztaty'
  //     });
  //     setWTwierdzaSet({
  //       labels: ['Zapłacony', 'Nie Zapłacony'],
  //       datasets: [
  //         {
  //           label: 'Wszyscy użytkownicy',
  //           data: countPaid(data),
  //           backgroundColor: ['rrgb(7, 110, 29)', 'rgb(233, 55, 23)'],
  //           borderWidth: 1
  //         }
  //       ]
  //     });
  //   } catch (error: any) {
  //     return;
  //   }
  // };

  // const getKrolestwoUsers = async () => {
  //   try {
  //     const { data } = await request('post', '/getSingleTable', {
  //       table_name: '4_KROLESTWO_1_warsztaty'
  //     });
  //     setWKrolestwoSet({
  //       labels: ['Zapłacony', 'Nie Zapłacony'],
  //       datasets: [
  //         {
  //           label: 'Wszyscy użytkownicy',
  //           data: countPaid(data),
  //           backgroundColor: ['rrgb(7, 110, 29)', 'rgb(233, 55, 23)'],
  //           borderWidth: 1
  //         }
  //       ]
  //     });
  //   } catch (error: any) {
  //     return;
  //   }
  // };

  useEffect(() => {
    getAllUsers();
    getDrzwiUsers();
    getWIPUsers();
    // getSejfUsers();
    // getTwierdzaUsers();
    // getKrolestwoUsers();
  }, []);

  return (
    <Grid container justifyContent="center" m={4}>
      <Grid item xs={12}>
        <Typography variant="h4">Wellcome to Impro Silesia Admin Panel</Typography>
        <Grid container justifyContent="center">
          <Grid item xs={6} textAlign="center">
            <Card sx={{ p: 4, maxWidth: '500px', margin: '0 auto' }}>
              <Typography variant="h6" textAlign="center">
                Wszyscy użytkownicy
              </Typography>
              {!allUsersDataSet ? <CircularProgress /> : <Doughnut data={allUsersDataSet} />}
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card sx={{ p: 4, maxWidth: '500px' }}>
              <Typography variant="h6" textAlign="center">
                Wszystkie wydarzenia
              </Typography>

              <Doughnut data={generalData} />
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card sx={{ p: 4, maxWidth: '500px', margin: '0 auto' }}>
              <Typography variant="h6" textAlign="center">
                Drzwi Do Impor 1
              </Typography>

              {!wDrzwiSet ? (
                <CircularProgress size={150} sx={{ mt: 11.5 }} />
              ) : (
                <Doughnut data={wDrzwiSet} />
              )}
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card sx={{ p: 4, maxWidth: '500px', margin: '0 auto' }}>
              <Typography variant="h6" textAlign="center">
                Weekendowa Impro Piguła
              </Typography>

              {!wWipSet ? (
                <CircularProgress size={150} sx={{ mt: 11.5 }} />
              ) : (
                <Doughnut data={wWipSet} />
              )}
            </Card>
          </Grid>
          {1 !== 1 && (
            <Grid item xs={3}>
              <Card sx={{ p: 4, maxWidth: '500px', margin: '0 auto' }}>
                <Typography variant="h6" textAlign="center">
                  Impro Sejf
                </Typography>

                {!wSejfSet ? (
                  <CircularProgress size={150} sx={{ mt: 11.5 }} />
                ) : (
                  <Doughnut data={wSejfSet} />
                )}
              </Card>
            </Grid>
          )}
          {1 !== 1 && (
            <Grid item xs={3}>
              <Card sx={{ p: 4, maxWidth: '500px', margin: '0 auto' }}>
                <Typography variant="h6" textAlign="center">
                  Impro Twierdza
                </Typography>

                {!wTwierdzaSet ? (
                  <CircularProgress size={150} sx={{ mt: 11.5 }} />
                ) : (
                  <Doughnut data={wTwierdzaSet} />
                )}
              </Card>
            </Grid>
          )}
          {1 !== 1 && (
            <Grid item xs={3}>
              <Card sx={{ p: 4, maxWidth: '500px', margin: '0 auto' }}>
                <Typography variant="h6" textAlign="center">
                  Impro Królestwo
                </Typography>

                {!wKrolestwoSet ? (
                  <CircularProgress size={150} sx={{ mt: 11.5 }} />
                ) : (
                  <Doughnut data={wKrolestwoSet} />
                )}
              </Card>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Home;
