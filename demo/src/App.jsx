import React from 'react'
import { Router } from '@reach/router'
import { connect } from 'react-redux'
import Layout from './Layout/Layout'
import Dashboard from './Routes/Dashboard'
import Details from './Routes/Details'
import PaperForm from './Component/PaperForm'
import VersionForm from './Component/VersionForm'
import AuthorForm from './Component/AuthorForm'
import ApproveForm from './Component/ApproveForm'
import './App.css'
import { updatePaper } from './action/action'

const { rootContract } = require('./address.json')

class App extends React.Component {
  componentDidMount() {
    window.M.AutoInit()
    const { dispatch } = this.props
    dispatch(updatePaper(rootContract))
  }

  openSideBar = () => {
    const elem = document.querySelector('.sidenav')
    const instance = window.M.Sidenav.getInstance(elem)
    instance.open()
  }

  render() {
    return (
      <Layout sideBar={this.openSideBar}>
        <Router>
          <Home path="/" />
          <Dashboard path="dashboard" />
          <PaperForm path="NewPaper" />
          <VersionForm path="NewVersion/:paper" />
          <AuthorForm path="RequestNewAuthor/:contractAddress" />
          <ApproveForm path="ApproveNewAuthor/:contractAddress" />
          <Details path="dashboard/:address" />
        </Router>
      </Layout>
    )
  }
}
export default connect()(App)
const Home = () => (
  <div>
    <div className="section">
      <h2>Prerequisite</h2>
      <h3>
        <a href="https://metamask.io">MetaMask</a>
      </h3>
      <h5>
        MetaMask is a bridge that allows you to visit the distributed web of
        tomorrow in your browser today. It allows you to run Ethereum dApps
        right in your browser without running a full Ethereum node.
      </h5>
      <h3>
        <a href="https://faucet.rinkeby.io/">Rinkeby</a>
      </h3>
      <h5>You also need some ethers to start</h5>
    </div>
    <div className="divider" />
    <div className="section">
      <h2>Introduction</h2>
      <p>
        Digitization and Web technologies are now changing the way of publish-
        ing and disseminating the knowledge. It becomes more convenient and less
        expensive for people to access the knowledge. The knowledge creation
        pro- cess is more dynamic right now. Text/graphics/rich media can be
        changed quickly and easily while at the same time being available to all
        the audi- ences. However, most of current methods of academic
        publication are static, that means, they cannot be revised over time[1].
        Web technologies actually have the power to make it more dynamic but is
        currently underused. On the other hands, journals, publishers and
        funders fully control the entire process of academic publishing. The
        view of authors who should also participate in the publishing process
        tends to be underrepresented. Despite that fact that the current
        academic publishing system is advance and productive, authors still want
        a more open and decentralize publishing process
      </p>
      <p>
        In the past, the scholarly books were keeping improving and updating for
        the centuries by releasing the new editions. Mistakes would be
        corrected, new result would be added and feedbacks would be used for
        improvement. Revising books allowed author to keep track with novel
        development. Many handbooks and schoolbooks have been revised over and
        over again, resulting massive amount of quality publications. In the
        contrast to books, academic paper were a kind of snapshot of certain
        scientific knowledge. Most of them were just published once.
      </p>
      <p>
        articles need to be published. But this kind of process are currently
        under debate and development. The number of authors who want a more open
        process in scientific publishing is increasing rapidly. When it comes to
        the traditional of academic publishing, publishers play an important
        role of l- tering good research, rejecting papers without sucient
        conclusions. They make their decisions based on the peer-review process
        which is fully con- trolled by themselves. Since this kind of
        peer-review process usually will take a signicant amount of time and is
        one of the main reason of delaying publications, researcher came up with
        a new idea of doing publishing. A ini- tial version will be rstly
        released, then it could be updated after receiving the feedbacks from
        pre-peer-review. All the version will be always available and the
        changes made in the pre-peer-review process will also be stored after
        the publishing of nal version. The model allows the tracking of the
        develop- ment of academic papers. This improvements make the process of
        publishing process more dynamic and exible. But, there are some vital
        problems that have been discussed under such models which is the
        mechanism to manage the interactions between authors and contributor in
        a trust way [3]. How can authors make agreements with each other about
        which version should be available ? How can authors determine their
        contributions to the papers in a unprejudiced way ? On the other hand,
        the contributions of reviewers is ignored in this model.
      </p>
      <p>
        In last few years, Distributed Ledger Technology have attracted public
        at- tentions as the most advanced tool that can provide a decentralized
        solutions to manage the interaction between people that may not trust
        each other. It also could guarantee the security and consistence without
        the need for admin. The special tools which could achieve such
        functionality is called Smart Con- tract. For the questions about the
        publishing model, Smart contract could be programed to help authors to
        making decision in a decentralized way. The aim of this project is
        trying to provide a prototype of decentralize application to help
        authors to manage their publish and their attribution agreements in a
        dynamic and trusted way. The application itself will use the blockchain
        technology [4], so nobody can fully control the whole process. It could
        be more reliable than the current publishing system. The implementation
        will be evaluated by the cost of using such system. A detailed cost
        analysis and data visualization will also be presented.
      </p>
    </div>
  </div>
)
