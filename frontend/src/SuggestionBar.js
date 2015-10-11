import React, { Component } from 'react';
import Card from 'material-ui/lib/card/card';
import CardMedia from 'material-ui/lib/card/card-media';
import CardActions from 'material-ui/lib/card/card-actions';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import RaisedButton from 'material-ui/lib/raised-button';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
import FloatingButton from 'material-ui/lib/floating-action-button';
import IconButton from 'material-ui/lib/icon-button';

export default class SuggestionBar extends Component {
  constructor(props) {
    super(props);
    this.state = {notRated:[]};
  }
  render() {
    return (
      <div className="row">
          <div className="col m2 offset-m12">
              <IconButton iconClassName="material-icons" tooltipPosition="top-center" tooltip="Reset preferences" onClick={this.reset}>autorenew</IconButton>
          </div>
        <div className="row">
          <MovieList name={this.props.name} update={this.getNotRated} notRated={this.state.notRated}/>
        </div>
      </div>
    );
  }

  componentWillMount() {
    this.getNotRated();
  }

  getNotRated = () => {
    var url = 'http://localhost:5000/getnotrated/' + this.props.name;
    $.ajax({
      url: url,
      contentType: 'application/json',
      dataType:'json',
      type: 'GET',
      processData: false,
      success: function(data) {
        console.log(data);
        this.setState(data);
      }.bind(this),
      error: function(data) {
        console.error(data.statusText);
      }.bind(this)
    });
  }

  reset = () => {
    var url = 'http://localhost:5000/resetuser/' + this.props.name;
    $.ajax({
      url: url,
      contentType: 'application/json',
      dataType:'json',
      type: 'GET',
      processData: false,
      success: function(data) {
        this.getNotRated();
      }.bind(this),
      error: function(data) {
        console.error(data.statusText);
      }.bind(this)
    });
  }
}
class MovieList extends Component {
  render() {
    var Movies = this.props.notRated.slice(0,4).map(function(movie, i){
      return (
        <MovieCard name={this.props.name} update = {this.props.update} title={movie['title']} url = {movie['url']} />
      )
    }.bind(this));
    return (
      <div className="row">
        {Movies}
      </div>
    );
  }
}
class MovieCard extends Component {
  render() {
    let buttonStyle = {
      fontSize: '150%',
      textAlign: 'center'
    };
    return (
      <div className="col m3">
        <Card>
          <CardMedia>
            <img src={this.props.url}/>
          </CardMedia>
          <CardActions>
            <div className="row">
              <FlatButton className="col m12" label="Like" labelStyle={buttonStyle} primary={true} onClick={this.likeMovie}/>
              <FlatButton className="col m12" label="Dislike" labelStyle={buttonStyle} secondary={true} onClick={this.dislikeMovie}/>
            </div>
          </CardActions>
        </Card>
      </div>
    );
  }

  likeMovie = () => {
      var data = {
      'username': this.props.name,
      'movie_likes': [this.props.title],
      'movie_dislikes': []
      };

      data = JSON.stringify(data);
    $.ajax({
      url: 'http://localhost:5000/sendscore',
      contentType: 'application/json',
      dataType:'json',
      type: 'POST',
      data: data,
      processData: false,
      success: (data) => {
        this.props.update()
      },
      error: function(data) {
        console.error(data.statusText);
      }.bind(this)
    });
  }

  dislikeMovie = () => {
    var data = {
    'username': this.props.name,
    'movie_likes': [],
    'movie_dislikes': [this.props.title]
    };

    data = JSON.stringify(data);
    $.ajax({
      url: 'http://localhost:5000/sendscore',
      contentType: 'application/json',
      dataType:'json',
      type: 'POST',
      data: data,
      processData: false,
      success: function(data) {
        this.props.update();
      }.bind(this),
      error: function(data) {
        console.error(data.statusText);
      }.bind(this)
    });
  }
}
