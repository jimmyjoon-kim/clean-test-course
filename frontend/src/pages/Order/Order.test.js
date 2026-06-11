import * as React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { API_URL } from '../../utils/constants';
import axios from 'axios';
import Order from '.';
import OrderContext from '../../context/OrderContext';

describe('Test Order', () => {
  let orderName;
  let orderItems;

  beforeEach(() => {
    orderName = 'test-fun';
    orderItems = [
      { item: 'Test 1', quantity: 1 },
      { item: 'Test 2', quantity: 2 },
      { item: 'Test 3', quantity: 3 },
    ];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Test Delivery Fee', async () => {
    setupMock();

    render(
      <OrderContext.Provider value={{ orderName, orderItems }}>
        <Order />
      </OrderContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('$2.50')).toBeInTheDocument();
    });
  });

  test('Test Update Delivery Fee', async () => {
    setupMock();

    render(
      <OrderContext.Provider value={{ orderName, orderItems }}>
        <Order />
      </OrderContext.Provider>
    );

    await userEvent.selectOptions(
      screen.getByRole('combobox'),
      screen.getByRole('option', { name: '5 miles' })
    );

    await waitFor(() => {
      expect(screen.getByText('$5.00')).toBeInTheDocument();
    });
  });
});

const setupMock = () => {
  const mockGet = jest.spyOn(axios, 'get');

  mockGet.mockImplementation((url) => {
    switch (url) {
      case `${API_URL}/api/delivery/test-fun/0`:
        return Promise.resolve({
          data: {
            status: 'success',
            data: 2.5,
          },
        });
      case `${API_URL}/api/delivery/test-fun/5`:
        return Promise.resolve({
          data: {
            status: 'success',
            data: 5.0,
          },
        });
      default:
        return Promise.resolve({
          data: {
            status: 'fail',
          },
        });
    }
  });
};
