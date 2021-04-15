import React from 'react';
import { BsFillPuzzleFill, BsFillChatFill, BsFillTerminalFill } from 'react-icons/bs';
import { MainContainer, MainHeader, MainSection } from '../main-pages/main-pages';
import PACKAGE from '../../../package.json';

export default function() {
  return (
    <MainContainer>
      <MainHeader title="Central de ajuda" />
      <MainSection icon={<BsFillTerminalFill />} title="Sobre">
        <p>
          Gestão financeira simplificada.
        </p>
        <hr />
        <p>
          <strong>Frifim</strong> é um acrônimo do inglês: <em lang="en">free independent financial management</em>,
          ou seja, gestão financeira independente e livre. Um projeto pensado para empoderar qualquer pessoa através
          da educação financeira, garantindo sua qualidade de vida e conquista de objetivos.
        </p>
        <p>
          Todo o código-fonte do sistema Frifim se encontra livre também, sob MIT License. Então se você tiver conhecimento
          técnico, pode ler como seus dados são tratados, investigar seus próprios problemas, desenvolver funcionalidades
          próprias ou até criar uma alternativa só sua.
        </p>
        <hr />
        <p><strong>Versão</strong>: {PACKAGE.version}</p>
      </MainSection>
      <MainSection icon={<BsFillPuzzleFill />} title="Perguntas frequentes">
        <p>
          No topo de cada página do sistema costuma ter um botão que explica sua utilidade, mas
          mesmo assim alguns pontos podem ficar confusos. Clique na dúvida para ver a resposta.
        </p>
        <hr />
        <h3>Sobre orçamentos</h3>
        <details>
          <summary>Por que planejar por orçamentos? Pra quê?</summary>
          <p>
            É como fazer uma checagem geral e periódica numa clínica geral, por exemplo.
            Vai te dar <strong>consciência</strong> de suas prioridades mensais
            e problemas para não fugir do controle.
          </p>
          <p>
            Feito o planejamento, os gráficos e números do Frifim vão te guiar a uma <strong>tomada
            inteligente de decisões</strong>. Se sua saúde financeira estiver boa, você verá
            pontos de melhoria para otimização, caso contrário irá ver quais os pontos críticos
            para recuperação.
          </p>
          <p>
            Você também ganha informações para estimar planos a longo prazo, como se organizar
            todo mês para viajar no final do ano, ou se aposentar mais cedo daqui a umas décadas.
          </p>
        </details>
        <details>
          <summary>Criar orçamento demora muito?</summary>
          <p>
            Não. Só precisa de 1 horinha na primeira vez, no máximo. Pois os meses seguintes
            podem ser uma cópia do anterior, o próprio Frifim pode fazer
            isso <strong>automaticamente</strong> quando você quiser.
          </p>
        </details>
        <details>
          <summary>Como orçar pela primeira vez?</summary>
          <p>
            Normalmente todo mundo tem um conjunto de despesas fixas (e receitas, espero), aquelas
            que você já sabe que tem todo mês.
          </p>
          <p>
            Então pode começar pegando suas <strong>faturas e extratos atuais</strong> pela casa
            ou internet banking, e imaginar que vai gastar os mesmos números todo mês. Aí é
            só cadastrar nas páginas de orçamento mensal ou semanal.
          </p>
          <p>
            <strong>Não pense demais.</strong> Nem tente se iludir modificando os números, pode
            jogar eles friamente no sistema. Quanto mais honesto seu raio-x de dados, mais óbvia
            vai ficar a decisão a tomar em cima deles.
          </p>
        </details>
        <details>
          <summary>Como deixar mais arrumado ainda?</summary>
          <p>
            Experimente <strong>etiquetar os orçamentos usando categorias</strong>.
            Assim, o Frifim vai te dizer com qual intensidade você usa cada categoria por mês.
            É comum que você gaste mais com determinado tipo de coisa e negligencie outras
            importantíssimas sem perceber. De todo modo, etiquetar os dados vai te gerar surpresas.
          </p>
        </details>
        <details>
          <summary>Como colocar as faturas de cartão?</summary>
          <p>
            Se a situação tiver muito feia, pode colocar o cartão inteiro como se fosse só
            uma linha de orçamento.
          </p>
          <p>
            Mas idealmente você precisa pegar a fatura e cadastrar como orçamento aquelas
            despesas que você enxergar, individual e detalhadamente.
          </p>
          <p>
            Parcelas também são inclusas nesse raciocínio. Então, por exemplo, se você tá
            pagando um celular desde o ano passado, o valor mensal entrara no orçamento
            com o nome do produto (e sua categoria).
          </p>
        </details>
        <details>
          <summary>Como orçar uma receita muito imprevisível/variável?</summary>
          <p>
            Pessoas que trabalham com vendas, por exemplo, têm receitas baseadas em
            comissões e não são fixas. Mesmo assim, é só colocar uma expectativa
            razoável (nem muito alta nem muito baixa) de dinheiro que deveria entrar
            dessa forma todo mês.
          </p>
        </details>
        <h3>Sobre transações</h3>
        <details>
          <summary>Por que transações e orçamentos?</summary>
          <p>
            Por exemplo, se você fez um orçamento de gastar 100 reais
            com lanches durante a semana e já gastou 20 reais em transação
            hoje, então ainda pode gastar 80 reais no resto da semana.
          </p>
          <p>
            Esse é exemplo é simples e dá pra calcular de cabeça, mas
            na vida real isso é mais complicado. Então se
            você cadastrar orçamentos e transações fielmente, o Frifim vai
            automatizar esse cálculo pra você.
            Além disso, você também enxergará intuitiva e visualmente
            em <strong>gráficos</strong> se a barrinha de uma despesa
            está alcançando a outra.
          </p>
        </details>
        <details>
          <summary>Demora para registrar transações?</summary>
          <p>
            Não. Só alguns segundos. Será ainda mais rápido se você estiver fazendo
            a transação de algo já cadastrado previamente como orçamento, pois
            em dois cliques um orçamento qualquer vira transação no Frifim.
          </p>
        </details>
        <details>
          <summary>Com que frequência devo registrar as transações?</summary>
          <p>
            Depende totalmente do seu dia a dia e perfil organizacional.
          </p>
          <p>
            Há quem cadastre na mesma hora, quase como um reflexo: recebeu a nota
            fiscal e já está entrando no Frifim. Outras pessoas
            preferem esperar até o fim do dia, puxar a fatura virtual e cadastrar de
            uma vez. Tem gente que espera até o fim da semana pra fazer isso.
          </p>
          <p>
            Faça como sentir confortável pra sempre lembrar. Ainda tem gente que prefere
            se manter ir na fé e nem cadastrar as transações (e tudo bem).
          </p>
        </details>
        <h3>Outras dúvidas</h3>
        <details>
          <summary>Serve para empresas?</summary>
          <p>
            Ainda não, o foco por ora é só de uso doméstico. Empresas têm mais atenção a detalhes
            como fluxo de caixa, contas bancárias, impostos explícitos, despesas variáveis,
            permissão de acesso etc.
          </p>
          <p>
            Mas entre em contato caso esteja interessado numa solução mais customizada.
          </p>
        </details>
        <details>
          <summary>Tem como adicionar uma nova funcionalidade?</summary>
          <p>
            Provavelmente, sim. É só entrar em contato (informações no fim da página).
          </p>
        </details>
        <details>
          <summary>Onde aprender mais sobre educação financeira?</summary>
          <p>
            Na página do Instagram tem dicas diárias (informações no fim da página).
            Lá são publicados explicação mais profunda de conceitos e técnicas poderosas
            para cuidar do seu dinheiro. Tudo de forma bem simplificada.
          </p>
        </details>
      </MainSection>
      <MainSection icon={<BsFillChatFill />} title="Contato">
        <p>
          Querendo falar com um ser humano? Sinta-se livre, é de graça também.
        </p>
        <ul>
          <li>
            Projeto no GitHub para pedidos de funções e reclamações de bugs publicamente:<br /><a href="https://github.com/mazuh/frifim/" target="blank">https://github.com/mazuh/frifim/</a>
          </li>
          <li>
            Página no Instagram para dicas diárias ou um contato mais particular:<br /><a href="https://www.instagram.com/frifimdicas/" target="blank">https://www.instagram.com/frifimdicas/</a>
          </li>
        </ul>
      </MainSection>
    </MainContainer>
  );
}
