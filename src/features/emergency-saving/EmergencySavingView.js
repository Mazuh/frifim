import React from 'react';
import { BsGear } from 'react-icons/bs';
import { MainContainer, MainHeader, MainSection } from '../main-pages/main-pages';

export default function EmergencySavingView() {
  return (
    <MainContainer>
      <MainHeader title="Reserva de emergência" />
      <MainSection icon={<BsGear />} title="Configuração"></MainSection>
    </MainContainer>
  );
}
