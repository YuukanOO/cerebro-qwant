import React from 'react';
import { Loading, KeyboardNav, KeyboardNavItem } from 'cerebro-ui'
import debounce from './debounce';
import styles from './styles.css'

const suggest = (suggestTerm) => {
  return fetch(`https://api.qwant.com/api/suggest?q=${suggestTerm}`)
    .then(r => r.json())
    .then(d => d.data.items.map(o => o.value));
};

class Preview extends React.Component {
  constructor() {
    super();
    this.state = { items: [], loading: false };
    this.retrieveSuggestionsUpdate = debounce(() => this.retrieveSuggestions(), 500);
  }

  retrieveSuggestions() {
    this.setState({ loading: true });
    
    suggest(this.props.query).then((items) => this.setState({
      items,
      loading: false,
    }));
  }

  componentDidMount() {
    this.retrieveSuggestions();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.query !== this.props.query) {
      this.retrieveSuggestionsUpdate();
    }
  }

  render() {
    return (
      <div className={(this.state.loading || this.state.items.length === 0) ? '' : styles.wrapper}>
        {this.state.loading ? 
        <Loading /> :
        (this.state.items.length > 0 ?
        <KeyboardNav>
          <ul className={styles.list}>
          {
            this.state.items.map(s => (
              <KeyboardNavItem
                key={s}
                tagName={'li'}
                onSelect={() => this.props.onSelected(s)}
              >
                {s}
              </KeyboardNavItem>
            ))
          }
          </ul>
        </KeyboardNav> :
        <p className={styles.noresults}>No suggestions</p>)}
      </div>
      );
  }
}

export const fn = ({ term, actions, display }) => {

  const search = (searchTerm) => {
    const q = encodeURIComponent(searchTerm)
    actions.open(`https://www.qwant.com/?q=${q}&t=all`)
    actions.hideWindow()
  }

  // Put your plugin code here
  display({
    title: `Search qwant for ${term}`,
    icon: 'https://www.qwant.com/favicon.png',
    onSelect: () => search(term),
    getPreview: () => <Preview query={term} onSelected={search} />,
  })
}