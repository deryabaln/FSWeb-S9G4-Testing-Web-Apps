import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';

test('hata olmadan render ediliyor', () => {
    render(<IletisimFormu />);
});

test('iletişim formu headerı render ediliyor', () => {
    render(<IletisimFormu />);

    const formHeader = screen.getByText('İletişim Formu');

    expect(formHeader).toBeInTheDocument();
});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
    const { getByLabelText, getByTestId } = render(<IletisimFormu />);
    const adInput = getByLabelText("Ad*");

    userEvent.type(adInput, "aaa");

    const errorMessages = await screen.getAllByTestId('error');
    expect(errorMessages).toHaveLength(1);
});

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {

    render(<IletisimFormu />);

    const submitButton = screen.getByText('Gönder');
    userEvent.click(submitButton);

    const errorMessages = screen.getAllByTestId('error');
    expect(errorMessages).toHaveLength(3);
});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu />);

    const adInput = screen.getByLabelText('Ad*');
    userEvent.type(adInput, 'Derya');

    const soyadInput = screen.getByLabelText('Soyad*');
    userEvent.type(soyadInput, 'Balın');

    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);

    const errorMessages = screen.getAllByTestId('error');
    expect(errorMessages).toHaveLength(1);
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {

    const { getByLabelText, getByTestId } = render(<IletisimFormu />);
    const emailInput = getByLabelText("Email*");

    fireEvent.change(emailInput, { target: { value: "ddddbbbb" } });
    const emailError = getByTestId("error");

    expect(emailError).toHaveTextContent(/email geçerli bir email adresi olmalıdır./i);

});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
    const { getByText } = render(<IletisimFormu />);


    const submitButton = getByText("Gönder");
    userEvent.click(submitButton);

    const soyadError = await screen.findByText("Hata: soyad gereklidir.");

    expect(soyadError).toBeInTheDocument();
});

test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', async () => {
    const { getByLabelText, queryByTestId, getByText } = render(<IletisimFormu />);

    const adInput = getByLabelText("Ad*");
    const soyadInput = getByLabelText("Soyad*");
    const emailInput = getByLabelText("Email*");

    const adValue = "derya";
    const soyadValue = "balın";
    const emailValue = "deryab@example.com";

    fireEvent.change(adInput, { target: { value: adValue } });
    fireEvent.change(soyadInput, { target: { value: soyadValue } });
    fireEvent.change(emailInput, { target: { value: emailValue } });

    const submitButton = getByText("Gönder");
    userEvent.click(submitButton);

    expect(getByText(adValue)).toBeInTheDocument();
    expect(getByText(soyadValue)).toBeInTheDocument();
    expect(getByText(emailValue)).toBeInTheDocument();
    expect(queryByTestId("error")).toBeNull();
});

test('form gönderildiğinde girilen tüm değerler render ediliyor.', async () => {
    const { getByLabelText, getByText } = render(<IletisimFormu />);

    const adInput = getByLabelText("Ad*");
    const soyadInput = getByLabelText("Soyad*");
    const emailInput = getByLabelText("Email*");
    const mesajInput = getByLabelText("Mesaj");

    const adValue = "derya";
    const soyadValue = "balın";
    const emailValue = "deryab@example.com";
    const mesajValue = "bu bir mesajdır!";

    fireEvent.change(adInput, { target: { value: adValue } });
    fireEvent.change(soyadInput, { target: { value: soyadValue } });
    fireEvent.change(emailInput, { target: { value: emailValue } });
    fireEvent.change(mesajInput, { target: { value: mesajValue } });

    const submitButton = getByText("Gönder");
    userEvent.click(submitButton);

    await waitFor(() => {
        expect(getByText(adValue)).toBeInTheDocument();
        expect(getByText(soyadValue)).toBeInTheDocument();
        expect(getByText(emailValue)).toBeInTheDocument();
        expect(getByText(mesajValue)).toBeInTheDocument();
    })

});








