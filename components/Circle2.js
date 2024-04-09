import Matter from 'matter-js';
import React from 'react';
import { View, Image } from 'react-native';

const Circle2 = (props) => {
    const widthBody = props.body.bounds.max.x - props.body.bounds.min.x;
    const heightBody = props.body.bounds.max.y - props.body.bounds.min.y;
    const xBody = props.body.position.x - widthBody / 2;
    const yBody = props.body.position.y - heightBody / 2;
    const color = props.color;

    return (
        <View style={{
            borderWidth: 0,
            borderStyle: "solid",
            position: 'absolute',
            left: xBody,
            top: yBody,
            width: widthBody,
            height: heightBody,
            borderRadius: props.radius,
            backgroundColor: color,
        }}
        >
            <Image
                source={props.imageSource}
                resizeMode="cover"
                style={{ width: "100%", height: "100%" }}
            />
        </View>
    );
};


export default (world, color, pos, radius, imageSource) => {
    const circle2 = Matter.Bodies.circle(pos.x, pos.y, radius, {
        label: 'circle2',
        isStatic: false,
    });

    Matter.World.add(world, circle2);
    return {
        body: circle2,
        color,
        radius,
        imageSource,
        isVisible: true,
        renderer: <Circle2 />
    };
};
