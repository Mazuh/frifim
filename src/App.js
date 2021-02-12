import "bootstrap/dist/css/bootstrap.min.css";
import "izitoast/dist/css/iziToast.min.css";
import "./App.css";
import './app/fixtures';
import React from "react";
import { Route, Switch, BrowserRouter, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BsExclamationTriangle } from "react-icons/bs";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import useIzitoastForResource from "./features/izitoast-for-resources/useIzitoastForResource";
import CategoriesView from "./features/categories/CategoriesView";
import { categoriesActions } from "./features/categories/categoriesDuck";
import MainMenu from "./features/navbar/MainMenu";
import MainFooter from "./features/navbar/MainFooter";
import MonthlyBudgetView from "./features/monthly-budget/MonthlyBudgetView";
import { monthlyBudgetActions } from "./features/monthly-budget/monthlyBudgetDuck";
import Home from "./features/home/Home";
import WeeklyBudgetView from "./features/weekly-budget/WeeklyBudgetView";
import { weeklyBudgetActions } from "./features/weekly-budget/weeklyBudgetDuck";
import TransactionsView from "./features/transactions/TransactionsView";
import { transactionsActions } from "./features/transactions/transactionsDuck";
import LoginView from "./features/auth/LoginView";
import useBasicRequestData from "./app/useBasicRequestData";
import { projectsActions } from "./features/projects/projectsDuck";
import { ProjectContext } from "./app/contexts";
import LoadingMainContainer from "./features/loading/LoadingMainContainer";

export default function App() {
  const dispatch = useDispatch();
  const { project, setProject } = React.useContext(ProjectContext);
  const defaultProject = useSelector(state => state.projects.items[0]);
  const isProjectsLoading = useSelector(state => state.projects.isLoading);
  const basicRequestData = useBasicRequestData();

  React.useEffect(() => {
    if (!basicRequestData.user) {
      return;
    }

    if (!defaultProject) {
      if (!isProjectsLoading) {
        dispatch(projectsActions.readAll(basicRequestData));
      }

      return;
    }

    if (!basicRequestData.project) {
      setProject(defaultProject);
      return;
    }

    dispatch(categoriesActions.readAll(basicRequestData));
    dispatch(monthlyBudgetActions.readAll(basicRequestData));
    dispatch(weeklyBudgetActions.readAll(basicRequestData));
    dispatch(transactionsActions.readAll(basicRequestData));
  }, [dispatch, basicRequestData, isProjectsLoading, defaultProject, setProject]);

  if (!project) {
    return <LoadingMainContainer />;
  }

  return (
    <ErrorGuard>
      <BrowserRouter>
        <MainMenu />
        <Page>
          <Switch>
            <ProtectedRoute exact path="/categorias">
              <CategoriesView />
            </ProtectedRoute>
            <ProtectedRoute exact path="/orçamento-mensal">
              <MonthlyBudgetView />
            </ProtectedRoute>
            <ProtectedRoute exact path="/orçamento-semanal">
              <WeeklyBudgetView />
            </ProtectedRoute>
            <ProtectedRoute exact path="/transacoes">
              <TransactionsView />
            </ProtectedRoute>
            <ProtectedRoute exact path="/inicio">
              <Home />
            </ProtectedRoute>
            <Route exact path="/login">
              <LoginView />
            </Route>
            <Route exact path="/">
              <LoginView />
            </Route>
            <Route exact path="/404">
              <NotFoundView />
            </Route>
            <Redirect to="/404" />
          </Switch>
        </Page>
        <MainFooter />
      </BrowserRouter>
    </ErrorGuard>
  );
}

const useAllResourceToasts = () => {
  useIzitoastForResource('transactions');
  useIzitoastForResource('monthlyBudget');
  useIzitoastForResource('weeklyBudget');
  useIzitoastForResource('categories');
  useIzitoastForResource('projects');
};

function Page(props) {
  useAllResourceToasts();

  return (
    <div className="mt-4 pt-5" {...props} />
  );
}

class ErrorGuard extends React.PureComponent {
  state = {
    isError: false,
  }

  componentDidCatch() {
    this.setState({ isError: true });
  }

  render() {
    if (this.state.isError) {
      return <UnknownCriticalErrorView />
    }

    return this.props.children;
  }
}

function NotFoundView() {
  return (
    <main className="container">
      <header>
        <h1><BsExclamationTriangle /> Ops...<br /><small>Página não encontrada.</small></h1>
      </header>
      <p>
        Navegue por outras páginas usando o menu principal.
      </p>
    </main>
  );
}

function UnknownCriticalErrorView() {
  return (
    <main className="container mt-2">
      <header>
        <h1>Eita!<br /><small>Erro interno desconhecido.</small></h1>
      </header>
      <p>
        Volte à <a href="/">página inicial</a> e reporte esse erro ao time de desenvolvimento.
      </p>
    </main>
  );
}
