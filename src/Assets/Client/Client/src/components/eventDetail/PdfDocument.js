import React, { useState } from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image
} from "@react-pdf/renderer";
import moment from "moment";
import { formatCNIC } from '../../utils/cnicFormat';

const styles = StyleSheet.create({
    infoBox: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "row",
        alignItems: 'center',
        flexWrap: 'wrap',
        width: "100%",
        padding: 8,
    },
    boxContent: {
        backgroundColor: "#D8D8D8",
        borderRadius: 6,
        padding: 10,
        display: 'flex',
        alignSelf: 'flex-start',
        alignContent: "flex-start",
        flexDirection: 'column',
        marginHorizontal: 2
    },
    boxText: {
        alignSelf: "center",
        marginTop: 2,
        padding: 2
    },
    textTitle: {
        color: '#008ae3',
        marginBottom: 5,
        paddingBottom: 5,
        borderBottomColor: '#000000',
        borderBottomStyle: 'solid',
        borderBottomWidth: 1,
        fontSize: 16
    },
    subTitle1: {
        color: '#000000',
        marginRight: 10,
        paddingBottom: 5,
        fontWeight: "bold",
        fontSize: 14,
        backgroundColor: '#F4F4F4',
        padding: 5
    },
    subTitle2: {
        color: '#404040',
        paddingBottom: 10,
        paddingRight: 15,
        paddingLeft: 10,
        fontSize: 13,
        fontWeight: "bold"
    },
    textPara: {
        color: "#505050",
        lineHeight: 1.3,
        display: "inline",
        fontSize: 12,
        paddingLeft: 5
    },
    container: {
        minHeight: "100%",
        padding: "15px",
        width: "100%",
        fontSize: 14,
    },
    containerBox: {
        padding: "10px",
        backgroundColor: '#EEEEEE',
        borderRadius: 8,
        marginBottom: 10
    },
    addressDetails: {
        background: "#f2f2f2",
        marginTop: "5px"
    },
    information: {
        padding: "10px",
        borderRadius: "9px",
        background: "#f2f2f2",
        marginTop: "10px"
    },
    responseDetailsContainer: {
        marginTop: "10px"
    },
    timeDistance: {
        padding: "10px",
        borderRadius: "9px",
        background: "#f2f2f2"
    },
    contactBox: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignSelf: "flex-start",
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: "2px",
        borderRadius: "9px",
        background: "#eeeeee",
        padding: "2px",
    },
    box: {
        marginTop: "2px",
        borderRadius: "9px",
        background: "#eeeeee",
        padding: "2px",
    },
    distanceTimeContainer: {
        height: "100px",
        marginTop: "10px",
        justifyContent: "space-evenly"
    },
    section: {
        marginVertical: 2
    }

})

function PdfDocument(props) {
    const [pdfData, setPdfData] = useState(props.data);
    return (
        <Document>
            <Page size="A4" >
                <View fixed>
                    <Text style={
                        {
                            textAlign: 'center',
                            padding: 10,
                            color: '#202020',
                            backgroundColor: "#CCCCCC"
                        }
                    }>
                        Incident details pdf document
                    </Text>
                </View>
                <View style={styles.container} >
                    <View style={styles.section}>
                        <Text style={styles.textTitle}>Occupancy Details</Text>
                        <View style={styles.containerBox}>
                            <Text style={styles.subTitle1}>Contact Details</Text>
                            {
                                pdfData.gatewayDetails.contacts.map((contact, i) => (
                                    <View key={`contact-${i}-`} style={styles.contactBox}>
                                        <Text style={styles.subTitle2}>{contact.firstName} {contact.lastName}</Text>
                                        <Text style={styles.textPara}>&nbsp; {contact.phone}</Text>
                                    </View>
                                ))
                            }
                        </View>
                        <View style={styles.containerBox}>
                            <Text style={styles.subTitle1}>Address Details</Text>
                            <View style={styles.addressDetails}>
                                <View style={styles.box}>
                                    <Text style={styles.subTitle2}> Location:&nbsp;&nbsp;&nbsp;
                                        <Text style={styles.textPara}>{pdfData.gatewayDetails.address.fullAddress}</Text>
                                    </Text>
                                    <Text style={styles.subTitle2}> City:&nbsp;&nbsp;&nbsp;
                                        <Text style={styles.textPara}>{pdfData.gatewayDetails.address.city}</Text>
                                    </Text>
                                    <Text style={styles.subTitle2}> Country:&nbsp;&nbsp;&nbsp;
                                        <Text style={styles.textPara}>{pdfData.gatewayDetails.address.country}</Text>
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.containerBox}>
                            <Text style={styles.subTitle1}>Mac Address</Text>
                            <View style={styles.box}>
                                <Text style={styles.subTitle2}>Device Mac Address</Text>
                                <Text style={styles.textPara}>&nbsp; {pdfData.gatewayDetails.macAddress}</Text>
                            </View>
                        </View>
                        <View style={styles.containerBox}>
                            <Text style={styles.subTitle1}>Information</Text>
                            <View style={styles.addressDetails}>
                                <View style={styles.box}>
                                    {/* Hide for now */}
                                    {/* <Text style={styles.subTitle2}> Duress code:&nbsp;&nbsp;&nbsp;
                                        <Text style={styles.textPara}>{pdfData.gatewayDetails.duressCode}</Text>
                                    </Text> */}
                                    <Text style={styles.subTitle2}> Pin code:&nbsp;&nbsp;&nbsp;
                                        <Text style={styles.textPara}>{pdfData.gatewayDetails.pinCode}</Text>
                                    </Text>
                                    <Text style={styles.subTitle2}> CNIC number:&nbsp;&nbsp;&nbsp;
                                        <Text style={styles.textPara}>{formatCNIC(pdfData.gatewayDetails.countryFields.value)}</Text>
                                    </Text>
                                </View>
                                <View style={styles.infoBoxWrap}>
                                    <View style={styles.infoBox}>
                                        <View style={styles.boxContent}>
                                            <Text>Adults</Text>
                                            <Text style={styles.boxText}>{pdfData.gatewayDetails.info?.persons || "0"}</Text>
                                        </View>
                                        <View style={styles.boxContent}>
                                            <Text>Elders</Text>
                                            <Text style={styles.boxText}>{pdfData.gatewayDetails.info?.persons || "0"}</Text>
                                        </View>
                                        <View style={styles.boxContent}>
                                            <Text>Handicapped</Text>
                                            <Text style={styles.boxText}>{pdfData.gatewayDetails.info?.disables || "0"}</Text>
                                        </View>
                                        <View style={styles.boxContent}>
                                            <Text>Children</Text>
                                            <Text style={styles.boxText}>{pdfData.gatewayDetails.info?.infants || "0"}</Text>
                                        </View>
                                        <View style={styles.boxContent}>
                                            <Text>Floors</Text>
                                            <Text style={styles.boxText}>{pdfData.gatewayDetails.info?.floors || "0"}</Text>
                                        </View>
                                        <View style={styles.boxContent}>
                                            <Text>Pets</Text>
                                            <Text style={styles.boxText}>{pdfData.gatewayDetails.info?.pets || "0"}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* hide due to static value */}
                    {/* <View style={styles.section}>
                        <Text style={styles.textTitle}>Response Unit Details</Text>
                        <View style={styles.containerBox}>
                            <Text style={styles.subTitle1}>Actual Distance and Time</Text>
                            <View style={styles.infoBoxWrap}>
                                <View style={styles.infoBox}>
                                    <View style={styles.boxContent}>
                                        <Text>Actual Distance</Text>
                                        <Text style={styles.boxText}>11.8km</Text>
                                    </View>
                                    <View style={styles.boxContent}>
                                        <Text>Actual Time</Text>
                                        <Text style={styles.boxText}>20 Min</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View> */}
                </View>
            </Page>
            <Page size="A4">
                <View style={styles.container} >
                    <View style={styles.section}>
                        <Text style={styles.textTitle}>Timeline Details</Text>
                        {
                            Object.keys(pdfData.timelineDetails).map(date => (
                                <>
                                    {
                                        pdfData.timelineDetails[date].events.map((e, i) => (
                                            <View key={`${e.eventUtc}-${i}`} style={[styles.containerBox, { marginBottom: 8 }]}>
                                                <Text style={styles.subTitle1}>{e.eventDesc}</Text>
                                                <View style={styles.box}>
                                                    <Text style={styles.subTitle2}>{e.origin?.name || e?.link || e?.subTitle}</Text>
                                                    <Text style={styles.textPara}>&nbsp;  {moment(e?.eventUtc, "YYYY-MM-DD, h:mm:ss a").format("dddd, MMMM Do YYYY, h:mm:ss a") || null}</Text>
                                                </View>
                                            </View>
                                        ))}
                                </>
                            ))
                        }
                    </View>
                </View>
            </Page>
        </Document>
    );
}

export default PdfDocument;
