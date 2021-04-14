import React from "react";
import { BsGear } from "react-icons/bs";
import { ProjectContext } from "../../app/contexts";
import { MainContainer, MainHeader, MainSection } from "../main-pages/main-pages";

export default function ProjectView() {
  const { project } = React.useContext(ProjectContext);

  return (
    <MainContainer>
      <MainHeader title="Projeto" hint={projectHint} />
      <MainSection icon={<BsGear/>} title="Configuração">
        Configurando {project.name}...
      </MainSection>
    </MainContainer>
  );
}

const projectHint = (
  <>
    <p>
      Projetos são como <strong>pastas para organizar</strong> seus
      orçamentos, transações e categorias.
    </p>
    <p>
      Por exemplo, você pode ter um projeto para suas
      finanças particulares, mas também ter outro para
      as finanças da família. Tudo isolado um do outro!
    </p>
  </>
);
