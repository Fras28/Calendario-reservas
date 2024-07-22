import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const YOUR_PUBLIC_KEY = process.env.REACT_APP_PUBLIC_KEY_MP;
const API_BACK = process.env.REACT_APP_API_URL;

const CheckoutPro = ({ info, onPaymentSuccess }) => {
  const comercio = useSelector((state) => state.reservas.comercio);
  const [isSDKReady, setIsSDKReady] = useState(false);
  const mpInstance = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.MercadoPago) {
        mpInstance.current = new window.MercadoPago(YOUR_PUBLIC_KEY, {
          locale: 'es-AR'
        });
        setIsSDKReady(true);
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!isSDKReady) return;
 
    try {
      const response = await fetch(`${API_BACK}/api/mercadopago/create-preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: comercio?.data.attributes.nombre,
          price: info?.precio,
          quantity: 1,
          payer: { email: info?.email }
        }),
      });

      const data = await response.json();

      const checkout = mpInstance.current.checkout({
        preference: {
          id: data.preferenceId
        },
        render: {
          container: '.cho-container',
          label: 'Pagar',
        }
      });

      checkout.on('payment', (data) => {
        if (data.status === 'approved') {
          onPaymentSuccess();
        }
      });
    } catch (error) {
      console.error("Error al procesar el pago:", error);
    }
  };

  return (
    <div>
      <button type="submit" onClick={handlePayment} disabled={!isSDKReady} style={{ width: "100%", padding: ".5rem", backgroundColor: "#71d2f2", borderRadius: "4px", display: "flex", justifyContent: "center", border: "solid 2px #253E8B" }}>
      <svg width="100"  viewBox="0 0 506 132" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M185.12 60.5365C185.12 27.1875 143.682 0 92.5625 0C41.4479 0 0.0104167 27.1875 0.0104167 60.5365C0.0104167 61.401 0 63.7813 0 64.0833C0 99.4635 36.2188 128.12 92.5521 128.12C149.234 128.12 185.12 99.474 185.12 64.0885C185.12 62.8542 185.12 62.1406 185.12 60.5365Z" fill="#253E8B"/>
      <path d="M181.578 60.5104C181.578 91.9531 141.734 117.443 92.5833 117.443C43.4323 117.443 3.5885 91.9531 3.5885 60.5104C3.5885 29.0625 43.4323 3.57291 92.5833 3.57291C141.734 3.57291 181.578 29.0625 181.578 60.5104Z" fill="#00AEEF"/>
      <path d="M63.0313 42.5469C62.9844 42.6354 62.099 43.5573 62.6719 44.2917C64.0781 46.0886 68.4167 47.1146 72.8021 46.1302C75.4115 45.5469 78.7604 42.8854 82.0052 40.3073C85.5156 37.5156 89.0052 34.724 92.5104 33.6094C96.2188 32.4271 98.599 32.9375 100.172 33.4115C101.896 33.9219 103.922 35.0573 107.156 37.4844C113.245 42.0625 137.729 63.4375 141.958 67.1302C145.37 65.5885 160.51 59.0729 181.089 54.5365C179.302 43.5677 172.625 33.526 162.505 25.3073C148.401 31.2344 131.161 34.3281 114.307 26.0938C114.219 26.0573 105.094 21.7396 96.099 21.9531C82.7188 22.2604 76.9271 28.0521 70.7969 34.1771L63.0313 42.5469Z" fill="white"/> 
      <path d="M140.964 69.4531C140.677 69.1979 112.172 44.2552 105.719 39.4063C101.979 36.6042 99.9011 35.8854 97.7188 35.6094C96.5834 35.4583 95.0105 35.6719 93.9167 35.974C90.9115 36.7917 86.9844 39.4167 83.4948 42.1823C79.8855 45.0573 76.4792 47.7656 73.323 48.474C69.2865 49.3802 64.3594 48.3073 62.1094 46.7917C61.198 46.1771 60.5573 45.4688 60.25 44.75C59.4167 42.8229 60.948 41.2813 61.2032 41.0261L69.0678 32.5156C69.9844 31.6042 70.9011 30.6927 71.8438 29.7917C69.3073 30.125 66.9584 30.7708 64.6771 31.4063C61.8282 32.2083 59.0886 32.9688 56.3125 32.9688C55.1563 32.9688 48.9532 31.9531 47.7761 31.6302C40.6563 29.6823 34.4063 27.7865 25.0782 23.4271C13.8959 31.7552 6.41671 42.1615 4.25525 53.625C5.86462 54.0521 8.45316 54.8229 9.54171 55.0625C34.8438 60.6875 42.724 66.4844 44.1563 67.6979C45.7032 65.974 47.9375 64.8854 50.4323 64.8854C53.2292 64.8906 55.7553 66.2917 57.2865 68.4688C58.7344 67.3229 60.7344 66.349 63.3178 66.349C64.4896 66.349 65.7084 66.5677 66.9375 66.9844C69.7917 67.9636 71.2657 69.8646 72.0313 71.5833C72.9896 71.1511 74.1667 70.8333 75.5521 70.8386C76.9167 70.8386 78.3334 71.1458 79.7605 71.7656C84.4271 73.7656 85.1511 78.349 84.7292 81.8021C85.0625 81.7656 85.3959 81.75 85.7344 81.75C91.2657 81.7552 95.7657 86.25 95.7657 91.7865C95.7657 93.5 95.3282 95.1094 94.5625 96.5208C96.0678 97.3698 99.9063 99.2813 103.276 98.8542C105.969 98.5156 106.99 97.5938 107.354 97.0781C107.604 96.724 107.87 96.3073 107.625 96.0104L100.484 88.0781C100.484 88.0781 99.3073 86.9636 99.698 86.5365C100.099 86.0938 100.828 86.7292 101.339 87.1563C104.974 90.1927 109.412 94.7708 109.412 94.7708C109.484 94.8229 109.781 95.4011 111.422 95.6979C112.833 95.9479 115.333 95.8021 117.063 94.3802C117.5 94.0208 117.938 93.5729 118.302 93.1094C118.276 93.1302 118.25 93.1667 118.224 93.1771C120.047 90.8386 118.021 88.474 118.021 88.474L109.682 79.1146C109.682 79.1146 108.495 78.0104 108.896 77.5677C109.26 77.1823 110.026 77.7656 110.552 78.1979C113.188 80.4063 116.917 84.1458 120.495 87.6458C121.188 88.1615 124.333 90.1042 128.49 87.3698C131.016 85.7136 131.521 83.6823 131.448 82.1458C131.276 80.1146 129.688 78.6667 129.688 78.6667L118.302 67.2188C118.302 67.2188 117.099 66.1927 117.526 65.6719C117.875 65.2344 118.656 65.8646 119.167 66.2917C122.792 69.3281 132.615 78.3333 132.615 78.3333C132.755 78.4323 136.146 80.849 140.339 78.1771C141.839 77.2188 142.797 75.7761 142.88 74.0938C143.021 71.1823 140.964 69.4531 140.964 69.4531Z" fill="white"/>
      <path d="M85.7343 83.9688C83.9687 83.9479 82.0364 84.9948 81.7864 84.8438C81.6458 84.75 81.8906 84.0417 82.0573 83.6302C82.2291 83.224 84.5521 76.2292 78.8854 73.7969C74.5468 71.9375 71.8958 74.0313 70.9843 74.9792C70.7448 75.2292 70.6406 75.2084 70.6093 74.8906C70.526 73.6302 69.9583 70.224 66.2187 69.0781C60.8698 67.4427 57.4271 71.1771 56.5521 72.5261C56.1614 69.474 53.5885 67.1094 50.427 67.1042C46.9948 67.1042 44.2135 69.8802 44.2135 73.3125C44.2083 76.7396 46.9895 79.5209 50.4218 79.5209C52.0885 79.5261 53.5989 78.8594 54.7135 77.7917C54.75 77.8229 54.7656 77.8802 54.7448 78C54.4843 79.5313 54.0052 85.1146 59.8489 87.3906C62.1927 88.2969 64.1875 87.6198 65.8385 86.4636C66.3281 86.1146 66.4114 86.2604 66.3385 86.724C66.1302 88.1615 66.3958 91.2344 70.7083 92.9792C73.9843 94.3125 75.9271 92.9479 77.1979 91.7761C77.75 91.2709 77.901 91.349 77.9271 92.1302C78.0833 96.2865 81.5364 99.5834 85.7239 99.5886C90.0416 99.5886 93.5416 96.099 93.5416 91.7865C93.5468 87.4688 90.0521 84.0156 85.7343 83.9688Z" fill="white"/>
      <path d="M85.7344 99.0313C81.823 99.026 78.6407 95.9844 78.4948 92.1146C78.4896 91.7813 78.4532 90.8958 77.7084 90.8958C77.3959 90.8958 77.1303 91.0833 76.823 91.3594C75.9636 92.1563 74.8698 92.9688 73.2709 92.9688C72.5417 92.9688 71.7553 92.7969 70.9271 92.4583C66.7917 90.7865 66.7344 87.9479 66.9011 86.8073C66.948 86.5 66.9636 86.1823 66.7553 85.9375L66.5 85.7135H66.2448C66.0365 85.7135 65.8178 85.7969 65.5261 86.0052C64.3282 86.8438 63.1823 87.25 62.0157 87.25C61.375 87.25 60.7188 87.1198 60.0573 86.8646C54.6198 84.75 55.0521 79.6146 55.3178 78.0729C55.3542 77.7552 55.2761 77.5156 55.0782 77.3542L54.6928 77.0365L54.3334 77.3802C53.2761 78.401 51.8855 78.9635 50.4323 78.9635C47.3125 78.9583 44.7761 76.4271 44.7813 73.3125C44.7813 70.1927 47.323 67.6667 50.4375 67.6667C53.2553 67.6667 55.6511 69.7865 56.0105 72.599L56.2032 74.1146L57.0365 72.8333C57.1303 72.6823 59.4115 69.2292 63.6094 69.2344C64.4063 69.2344 65.2292 69.3594 66.0625 69.6198C69.4063 70.6406 69.974 73.6719 70.0625 74.9375C70.1198 75.6719 70.6459 75.7083 70.75 75.7083C71.0365 75.7083 71.25 75.526 71.4011 75.3646C72.0313 74.7083 73.4063 73.6146 75.5573 73.6146C76.5417 73.6146 77.5938 73.849 78.6719 74.3125C83.9896 76.5938 81.5782 83.349 81.5521 83.4219C81.0938 84.5417 81.073 85.0365 81.5053 85.3229L81.7136 85.4219H81.8698C82.1094 85.4219 82.4063 85.3177 82.8959 85.151C83.6198 84.901 84.7136 84.526 85.7344 84.526H85.7396C89.7396 84.5729 92.9948 87.8281 92.9948 91.7865C92.9896 95.7813 89.7344 99.0313 85.7344 99.0313ZM142.068 66.4688C133.287 58.8073 112.995 41.1667 107.5 37.0365C104.359 34.6771 102.219 33.4271 100.339 32.8698C99.4948 32.6146 98.323 32.3229 96.8178 32.3229C95.4219 32.3229 93.9219 32.5729 92.3542 33.0729C88.8021 34.1979 85.2657 37.0104 81.8386 39.7292L81.6615 39.8698C78.474 42.4063 75.1823 45.026 72.6875 45.5833C71.599 45.8281 70.4792 45.9531 69.3646 45.9531C66.5678 45.9531 64.0625 45.1458 63.1198 43.9479C62.9636 43.7448 63.0625 43.4271 63.4271 42.9635L63.4792 42.901L71.2032 34.5781C77.25 28.526 82.9636 22.8177 96.1198 22.5156C96.3334 22.5104 96.5573 22.5052 96.7761 22.5052C104.964 22.5104 113.146 26.1771 114.063 26.599C121.74 30.3438 129.667 32.2448 137.63 32.25C145.932 32.2552 154.5 30.1979 163.505 26.0521C162.5 25.2083 161.453 24.3854 160.375 23.5781C152.464 27.0052 144.927 28.7396 137.656 28.7396C130.224 28.7292 122.807 26.9479 115.599 23.4323C115.219 23.25 106.182 18.9896 96.7761 18.9844C96.5313 18.9844 96.2813 18.9896 96.0365 18.9948C84.9896 19.25 78.7657 23.1771 74.5782 26.6146C70.5105 26.7135 66.9948 27.6927 63.875 28.5677C61.0834 29.3385 58.6771 30.0104 56.3282 30.0104C55.3594 30.0104 53.6198 29.9219 53.4636 29.9167C50.7657 29.8333 37.1563 26.5 26.3334 22.401C25.2292 23.1823 24.1667 23.9896 23.1302 24.8125C34.4375 29.4479 48.198 33.0313 52.5417 33.3125C53.75 33.3958 55.0365 33.5313 56.323 33.5313C59.198 33.5313 62.0625 32.7292 64.8386 31.9531C66.474 31.4896 68.2813 30.9896 70.1875 30.625C69.6771 31.125 69.1719 31.6302 68.6615 32.1354L60.8178 40.625C60.198 41.25 58.8542 42.9167 59.7396 44.9635C60.0938 45.7917 60.8073 46.5833 61.8073 47.2552C63.6719 48.5156 67.0209 49.3646 70.1355 49.3698C71.3125 49.3698 72.4323 49.25 73.4584 49.0208C76.7448 48.2813 80.198 45.5313 83.8542 42.625C86.7657 40.3125 90.9011 37.375 94.073 36.5104C94.9584 36.2708 96.0469 36.1198 96.9167 36.1198C97.1771 36.125 97.4271 36.1302 97.6563 36.1667C99.75 36.4271 101.771 37.1406 105.385 39.8542C111.828 44.6927 140.333 69.6302 140.615 69.8802C140.63 69.8958 142.448 71.4583 142.323 74.0677C142.255 75.5208 141.448 76.8125 140.047 77.7083C138.828 78.4792 137.573 78.8698 136.307 78.8698C134.401 78.8698 133.089 77.974 133 77.9167C132.896 77.8281 123.13 68.875 119.537 65.8646C118.964 65.3906 118.406 64.9635 117.844 64.9635C117.547 64.9635 117.281 65.0885 117.099 65.3177C116.537 66.0156 117.167 66.9792 117.917 67.6146L129.323 79.0781C129.339 79.0938 130.745 80.4115 130.896 82.1719C130.99 84.0729 130.078 85.6615 128.188 86.901C126.844 87.7865 125.479 88.2396 124.146 88.2396C122.396 88.2396 121.162 87.4375 120.891 87.25L119.255 85.6354C116.266 82.6927 113.177 79.651 110.917 77.7656C110.365 77.3073 109.776 76.8854 109.214 76.8854C108.938 76.8854 108.688 76.9844 108.495 77.1875C108.24 77.474 108.057 77.9896 108.703 78.8438C108.964 79.1927 109.276 79.4844 109.276 79.4844L117.604 88.8385C117.672 88.9219 119.318 90.8802 117.792 92.8281L117.495 93.1979C117.25 93.474 116.979 93.7292 116.724 93.9479C115.302 95.1146 113.406 95.2396 112.656 95.2396C112.255 95.2396 111.865 95.2031 111.531 95.1406C110.708 94.9948 110.156 94.7656 109.885 94.4479L109.787 94.3438C109.333 93.875 105.135 89.5885 101.662 86.6927C101.208 86.3073 100.635 85.8229 100.047 85.8229C99.7553 85.8229 99.4948 85.9375 99.2917 86.1615C98.6042 86.9115 99.6355 88.0365 100.073 88.4531L107.177 96.2813C107.167 96.349 107.078 96.5104 106.906 96.7604C106.651 97.1094 105.792 97.974 103.214 98.2969C102.906 98.3385 102.589 98.3542 102.271 98.3542C99.6146 98.3542 96.7813 97.0625 95.323 96.2917C95.9896 94.8854 96.3334 93.3385 96.3334 91.7917C96.3334 85.9427 91.5886 81.1875 85.7448 81.1875C85.6198 81.1875 85.4896 81.1875 85.3646 81.1927C85.5521 78.526 85.1771 73.474 79.9896 71.25C78.4948 70.6042 77.0053 70.276 75.5625 70.276C74.4271 70.276 73.3386 70.4688 72.3178 70.8594C71.2396 68.7708 69.4584 67.25 67.1303 66.4583C65.8438 66.0156 64.5625 65.7865 63.3282 65.7865C61.1667 65.7865 59.1823 66.4219 57.4063 67.6823C55.7084 65.5729 53.1407 64.3177 50.4375 64.3177C48.073 64.3177 45.7969 65.2656 44.1146 66.9375C41.9011 65.25 33.1355 59.6771 9.66671 54.349C8.53129 54.0938 5.92712 53.3438 4.32817 52.8802C4.06254 54.1458 3.85942 55.4323 3.724 56.7292C3.724 56.7292 8.05212 57.7656 8.90629 57.9583C32.8802 63.2813 40.7969 68.8177 42.1407 69.8646C41.6823 70.9531 41.448 72.125 41.448 73.3125C41.4428 78.2604 45.474 82.2969 50.4271 82.3021C50.9844 82.3021 51.5365 82.25 52.073 82.151C52.823 85.7969 55.2084 88.5625 58.849 89.9792C59.9167 90.3854 60.9948 90.599 62.0521 90.599C62.7344 90.599 63.4271 90.5156 64.099 90.3438C64.7709 92.0521 66.2865 94.1823 69.6719 95.5573C70.8594 96.0365 72.0469 96.2865 73.198 96.2865C74.1407 96.2865 75.0625 96.1198 75.9428 95.7969C77.5625 99.75 81.4271 102.365 85.7292 102.365C88.5834 102.37 91.323 101.208 93.323 99.151C95.0313 100.104 98.6407 101.823 102.287 101.828C102.76 101.828 103.203 101.792 103.646 101.74C107.271 101.286 108.953 99.8646 109.729 98.7656C109.87 98.5729 109.995 98.3698 110.104 98.1563C110.958 98.4063 111.896 98.6042 112.974 98.6094C114.953 98.6094 116.854 97.9323 118.771 96.5313C120.656 95.1771 121.995 93.224 122.188 91.5625C122.193 91.5365 122.198 91.5156 122.203 91.4896C122.833 91.6198 123.49 91.6875 124.141 91.6875C126.177 91.6875 128.177 91.0521 130.094 89.7969C133.787 87.3802 134.427 84.2188 134.37 82.1458C135.01 82.2813 135.672 82.349 136.328 82.349C138.24 82.349 140.12 81.776 141.906 80.6354C144.198 79.1719 145.573 76.9323 145.781 74.3229C145.927 72.5521 145.49 70.7656 144.552 69.2292C150.74 66.5625 164.88 61.4063 181.531 57.651C181.432 56.3594 181.245 55.0833 181.016 53.8125C160.87 58.2865 145.833 64.7917 142.068 66.4688Z" fill="#253E8B"/>
      <path d="M492.224 45.9792C490.604 48.1302 488.286 49.2031 485.255 49.2031C482.229 49.2031 479.896 48.1302 478.266 45.9792C476.63 43.8281 475.818 40.7656 475.818 36.8021C475.818 32.8385 476.63 29.7865 478.266 27.6458C479.896 25.5104 482.229 24.4375 485.255 24.4375C488.286 24.4375 490.604 25.5104 492.224 27.6458C493.844 29.7865 494.661 32.8385 494.661 36.8021C494.661 40.7656 493.844 43.8281 492.224 45.9792ZM500.505 21.9635C497.161 17.7812 492.094 15.6875 485.286 15.6875C478.49 15.6875 473.417 17.7812 470.078 21.9635C466.734 26.151 465.062 31.0938 465.062 36.8021C465.062 42.6094 466.734 47.5729 470.078 51.7031C473.417 55.8177 478.49 57.8854 485.286 57.8854C492.094 57.8854 497.161 55.8177 500.505 51.7031C503.849 47.5729 505.516 42.6094 505.516 36.8021C505.516 31.0938 503.849 26.151 500.505 21.9635Z" fill="#253E8B"/>
      <path d="M409.859 41.0886C409.792 44.5625 408.797 46.9583 406.885 48.2656C404.974 49.5781 402.885 50.2396 400.62 50.2396C399.188 50.2396 397.974 49.8386 396.974 49.0521C395.974 48.2604 395.479 46.9792 395.479 45.2031C395.479 43.2188 396.292 41.75 397.927 40.7969C398.901 40.2448 400.484 39.7656 402.703 39.3854L405.068 38.9479C406.245 38.724 407.172 38.4844 407.849 38.2292C408.536 37.9792 409.198 37.6458 409.859 37.2292V41.0886ZM415.125 18.4636C411.734 16.75 407.859 15.8802 403.495 15.8802C396.786 15.8802 392.052 17.6302 389.297 21.125C387.563 23.3646 386.594 26.2136 386.365 29.6875H396.385C396.635 28.1563 397.125 26.9427 397.865 26.0469C398.901 24.8333 400.656 24.224 403.141 24.224C405.359 24.224 407.042 24.5261 408.188 25.1563C409.328 25.7708 409.901 26.8958 409.901 28.5208C409.901 29.8594 409.161 30.8386 407.661 31.474C406.828 31.8386 405.448 32.1406 403.51 32.3854L399.958 32.8229C395.927 33.3281 392.859 34.1823 390.786 35.375C386.99 37.5625 385.099 41.0886 385.099 45.974C385.099 49.7344 386.271 52.6458 388.63 54.6979C390.984 56.75 393.979 57.6094 397.594 57.7813C420.255 58.7917 420 45.8386 420.208 43.1406V28.2292C420.208 23.4479 418.51 20.1927 415.125 18.4636Z" fill="#253E8B"/>
      <path d="M363.448 24.7604C366.042 24.7604 367.943 25.5625 369.172 27.1614C370.016 28.3437 370.542 29.6823 370.745 31.1614H381.927C381.313 25.5208 379.339 21.5833 376.005 19.3489C372.661 17.1302 368.385 16.0104 363.151 16.0104C356.99 16.0104 352.156 17.901 348.661 21.6771C345.161 25.4583 343.411 30.7396 343.411 37.5312C343.411 43.5417 344.995 48.4427 348.161 52.2239C351.328 55.9948 356.271 57.8854 362.99 57.8854C369.714 57.8854 374.786 55.625 378.208 51.0937C380.349 48.2864 381.552 45.3073 381.807 42.1614H370.667C370.438 44.2396 369.786 45.9375 368.708 47.2448C367.635 48.5469 365.823 49.2031 363.26 49.2031C359.656 49.2031 357.198 47.5625 355.891 44.2604C355.177 42.5052 354.818 40.1771 354.818 37.276C354.818 34.2344 355.177 31.7969 355.891 29.9583C357.25 26.5 359.771 24.7604 363.448 24.7604Z" fill="#253E8B"/>
      <path d="M340.417 16.0104C317.453 16.0104 318.813 36.3437 318.813 36.3437V56.9948H329.229V37.625C329.229 34.4531 329.63 32.0989 330.427 30.5729C331.854 27.8646 334.651 26.5052 338.818 26.5052C339.13 26.5052 339.542 26.5208 340.052 26.5469C340.557 26.5677 341.136 26.6146 341.797 26.6927V16.0885C341.333 16.0573 341.037 16.0469 340.906 16.0312C340.771 16.0208 340.609 16.0104 340.417 16.0104Z" fill="#253E8B"/>
      <path d="M288.13 26.8021C289.599 25.2969 291.656 24.5417 294.307 24.5417C296.755 24.5417 298.797 25.25 300.448 26.6771C302.094 28.0937 303.016 30.1823 303.203 32.9271H285.375C285.745 30.3489 286.667 28.3125 288.13 26.8021ZM302.135 46.2031C301.698 46.8281 301.229 47.3646 300.708 47.7812C299.24 48.9948 297.24 49.3594 294.885 49.3594C292.656 49.3594 290.917 49.0208 289.339 48.026C286.74 46.4323 285.276 43.7292 285.12 39.7552H313.953C313.995 36.3385 313.88 33.7239 313.604 31.901C313.125 28.8021 312.073 26.0677 310.453 23.7187C308.656 21.0521 306.37 19.0989 303.609 17.8594C300.854 16.625 297.755 16.0104 294.307 16.0104C288.5 16.0104 283.786 17.8385 280.151 21.4948C276.516 25.1562 274.693 30.4114 274.693 37.2656C274.693 44.5885 276.708 49.8698 280.74 53.1146C284.766 56.3594 289.417 57.9896 294.682 57.9896C301.063 57.9896 306.026 56.0625 309.573 52.2135C311.484 50.1875 312.682 48.1823 313.188 46.2031H302.135Z" fill="#253E8B"/>
      <path d="M270.51 56.9896H260.99V33.0208C260.99 30.8333 260.271 25.625 253.99 25.625C249.802 25.625 246.776 28.6458 246.776 33.0208V56.9896H237.25V33.0208C237.25 30.8333 236.599 25.625 230.323 25.625C226.063 25.625 223.104 28.6458 223.104 33.0208V56.9896H213.583V33.25C213.583 23.3542 220.146 15.8698 230.323 15.8698C235.375 15.8698 239.484 17.9948 242.156 21.3958C244.969 17.9948 249.151 15.8698 253.99 15.8698C264.38 15.8698 270.51 23.0521 270.51 33.25V56.9896Z" fill="#253E8B"/>
      <path d="M449.464 46.0625C447.943 48.2448 445.708 49.3333 442.781 49.3333C439.849 49.3333 437.667 48.2344 436.229 46.0469C434.792 43.8489 434.073 40.6614 434.073 37.0052C434.073 33.6146 434.776 30.776 436.193 28.4896C437.604 26.2031 439.823 25.0573 442.854 25.0573C444.839 25.0573 446.583 25.6823 448.089 26.9427C450.531 29.026 451.755 32.7604 451.755 37.6042C451.755 41.0625 450.99 43.8854 449.464 46.0625ZM461.964 3.49478C461.964 3.49478 451.464 2.37499 451.464 10.8073L451.458 21.9687C450.297 20.1042 448.786 18.6406 446.922 17.5937C445.063 16.5417 442.932 16.0104 440.526 16.0104C435.323 16.0104 431.172 17.9479 428.057 21.8229C424.943 25.6979 423.396 31.2812 423.396 38.0364C423.396 43.8958 424.974 48.6979 428.13 52.4427C431.292 56.1771 437.49 57.8177 442.99 57.8177C462.177 57.8177 461.953 41.3594 461.953 41.3594L461.964 3.49478Z" fill="#253E8B"/>
      <path d="M307.135 94.9323C307.135 91.0052 306.37 87.9844 304.833 85.8646C303.302 83.7552 301.109 82.6875 298.245 82.6875C295.495 82.6875 293.344 83.7552 291.807 85.8646C290.385 87.7813 289.672 90.8125 289.672 94.9323C289.672 98.7761 290.432 101.635 291.969 103.552C293.495 105.672 295.698 106.729 298.552 106.729C301.208 106.729 303.302 105.672 304.833 103.552C306.37 101.438 307.135 98.5729 307.135 94.9323ZM289.672 123.13C289.672 124.536 289.161 125.75 288.13 126.755C287.115 127.766 285.891 128.271 284.458 128.271H279.255V92.0573C279.255 85.0156 281.625 80.6094 285.531 77.625C288.115 75.6563 291.958 73.7761 299.167 73.7761C304.031 73.7761 309.729 75.6667 312.807 79.4167C316.26 83.6354 317.698 88.3386 317.698 94.4792C317.698 100.833 316.167 105.958 313.109 109.901C310.047 113.734 306.109 115.641 301.307 115.641C298.755 115.641 296.51 115.188 294.573 114.286C292.521 113.276 290.896 111.714 289.672 109.594V123.13Z" fill="#00AEEF"/>
      <path d="M369.589 94.9375C369.589 101.885 371.599 105.734 375.609 106.495C379.615 107.24 382.578 106.307 384.484 103.693C385.391 102.594 386.036 100.849 386.443 98.4896C386.839 96.125 386.87 93.7813 386.516 91.4688C386.172 89.1458 385.339 87.0833 384.031 85.2708C382.734 83.4635 380.823 82.5521 378.318 82.5521C374.906 82.5521 372.604 83.8177 371.396 86.3229C370.188 88.8438 369.589 91.7135 369.589 94.9375ZM386.745 112.302V109.745C384.943 112.568 382.5 114.318 379.443 115.026C376.385 115.729 373.349 115.479 370.349 114.266C367.333 113.063 364.75 110.823 362.594 107.552C360.438 104.271 359.365 99.9688 359.365 94.6302C359.365 88.3958 360.792 83.3333 363.646 79.4583C366.505 75.5833 371.099 73.8125 377.417 73.6406C383.641 73.474 387.26 74.8854 390.807 77.5677C394.682 80.5104 396.974 85.0208 396.974 92.0677V113.37C396.99 120.146 392.26 132.708 377.417 131.646C368.219 130.979 363.115 127.203 360.266 118.656H371.25C372.052 120.063 373.276 121.141 374.938 121.891C376.583 122.656 378.25 122.854 379.891 122.5C381.547 122.146 383.052 121.161 384.417 119.557C385.766 117.948 386.542 115.526 386.745 112.302Z" fill="#00AEEF"/>
      <path d="M345.182 99.1406C345.115 102.615 344.12 105.005 342.214 106.318C340.302 107.625 338.214 108.281 335.948 108.281C334.51 108.281 333.297 107.885 332.302 107.099C331.302 106.313 330.802 105.026 330.802 103.25C330.802 101.266 331.62 99.7969 333.255 98.849C334.229 98.2917 335.813 97.8125 338.026 97.4323L340.391 96.9948C341.573 96.7709 342.5 96.5313 343.172 96.2761C343.859 96.0261 344.521 95.6979 345.182 95.2813V99.1406ZM350.448 76.5156C347.057 74.8021 343.182 73.9323 338.823 73.9323C332.109 73.9323 327.38 75.6823 324.62 79.1771C322.891 81.4115 321.917 84.2604 321.693 87.7396H331.719C331.964 86.2031 332.453 84.9896 333.193 84.0938C334.229 82.8802 335.984 82.2761 338.464 82.2761C340.693 82.2761 342.37 82.5781 343.51 83.2031C344.651 83.8229 345.229 84.9479 345.229 86.5729C345.229 87.9063 344.484 88.8906 342.99 89.5261C342.161 89.8906 340.776 90.1927 338.839 90.4375L335.286 90.8698C331.255 91.3802 328.188 92.2344 326.115 93.4219C322.318 95.6094 320.422 99.1406 320.422 104.021C320.422 107.781 321.599 110.693 323.958 112.745C326.313 114.792 329.307 115.661 332.922 115.828C355.573 116.839 355.323 103.88 355.531 101.188V86.2761C355.531 81.4948 353.839 78.2448 350.448 76.5156Z" fill="#00AEEF"/>
      <path d="M428.109 103.802C426.49 105.958 424.167 107.031 421.141 107.031C418.109 107.031 415.776 105.958 414.151 103.802C412.51 101.656 411.698 98.599 411.698 94.6354C411.698 90.6719 412.51 87.6198 414.151 85.4792C415.776 83.3386 418.109 82.2761 421.141 82.2761C424.167 82.2761 426.49 83.3386 428.109 85.4792C429.729 87.6198 430.542 90.6719 430.542 94.6354C430.542 98.599 429.729 101.656 428.109 103.802ZM436.391 79.7969C433.047 75.6094 427.974 73.5208 421.167 73.5208C414.375 73.5208 409.297 75.6094 405.958 79.7969C402.615 83.9792 400.943 88.9219 400.943 94.6354C400.943 100.443 402.615 105.401 405.958 109.531C409.297 113.646 414.375 115.714 421.167 115.714C427.974 115.714 433.047 113.646 436.391 109.531C439.729 105.401 441.391 100.443 441.391 94.6354C441.391 88.9219 439.729 83.9792 436.391 79.7969Z" fill="#00AEEF"/>
      </svg>
      </button>
      <div className="cho-container"></div>
    </div>
  );
};

export default CheckoutPro;

