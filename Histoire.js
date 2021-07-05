import React from 'react';
import { StyleSheet, Text, View, Image, FlatList, ScrollView, } from 'react-native';
import axios from 'axios';
import { Button } from 'react-native-elements';




export default class Histoire extends React.Component {

    constructor(props) {
        super(props)
        this.state = { tabDonée: [] };
        this.uneHistoire = this.uneHistoire.bind(this);
    }
    uneHistoire() {
        axios.post('https://api-v2.7-dev.mybookinou.com/api/users/login', {
            username: 'technical_test@bookinou.com',
            password: 'test69'
        })
            .then((reponse) => {
                const token = reponse.data["hydra:description"]
                axios({
                    method: 'post',
                    url: 'https://api-v2.7-dev.mybookinou.com/api/graphql',
                    headers: { 'Authorization': `Bearer ${token}` },
                    data: {
                        query:
                            `{
                      stories {
                        edges {
                          node {
                            id
                            title
                            picture {
                              id
                              contentUrl
                            }
                          }
                        }
                      }
                    }`
                    }
                })
                    .then((reponse) => {
                        this.setState({
                            tabDonée: [...this.state.tabDonée, ...reponse.data.data.stories.edges.map((e) => (e))]
                        })
                    })
                    .catch(error => {
                        console.log('There has been a problem with your fetch operation: ' + error.message);
                    });
            })
        return (
            this.state.tabDonée
        )
    }
    render() {
        return (
            <View style={styles.container}>

                <Text>Consulter nos histoires</Text>
                <Button title="chercher une histoire" onPress={this.uneHistoire} />
                <ScrollView>
                    <View>
                        <FlatList
                            data={this.state.tabDonée}
                            keyExtractor={(item) => item.node.id.toString()}
                            renderItem={({ item }) => <Text style={styles.content_container}>{item.node.title}</Text>}
                            renderItem={({ item }) => <Image style={styles.image} source={{ uri: item.node.picture.contentUrl }} />}
                        />
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    image: {
        width: 180,
        height: 130,
        margin: 5,
        backgroundColor: 'gray',
        resizeMode: 'cover'
    },
    content_container: {
        flex: 1,
        margin: 5
    },

})
